import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createFakeSpellingWorker,
  type FakeSpellingWorker,
} from './fake-spelling-worker'

const { createSpellingWorker } = vi.hoisted(() => ({
  createSpellingWorker: vi.fn<() => Worker | null>(),
}))

vi.mock('@/lib/spelling/create-spelling-worker', () => ({ createSpellingWorker }))

async function importFreshSpellingClient() {
  vi.resetModules()
  return import('@/lib/spelling/spelling-client')
}

function startFakeWorkers() {
  const startedWorkers: FakeSpellingWorker[] = []
  createSpellingWorker.mockImplementation(() => {
    const fakeWorker = createFakeSpellingWorker()
    startedWorkers.push(fakeWorker)
    return fakeWorker.worker
  })
  return startedWorkers
}

describe('spelling client', () => {
  beforeEach(() => {
    createSpellingWorker.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('finds nothing and stays quiet when workers are not supported', async () => {
    createSpellingWorker.mockReturnValue(null)
    const client = await importFreshSpellingClient()

    await expect(client.checkWords(['proceso'])).resolves.toEqual(new Set())
    await expect(client.suggestCorrections('proceso')).resolves.toEqual([])
    expect(client.isSpellingEngineUnavailable()).toBe(true)
  })

  it('reports the words the worker found misspelled', async () => {
    const workers = startFakeWorkers()
    const client = await importFreshSpellingClient()

    const misspelled = client.checkWords(['processo', 'proceso', 'proceso'])
    const request = workers[0].receivedRequests[0]
    expect(request).toMatchObject({ kind: 'check', words: ['processo', 'proceso'] })
    workers[0].respond({ id: request.id, kind: 'checked', misspelled: ['proceso'] })

    await expect(misspelled).resolves.toEqual(new Set(['proceso']))
  })

  it('answers already checked words without asking the worker again', async () => {
    const workers = startFakeWorkers()
    const client = await importFreshSpellingClient()

    const firstCheck = client.checkWords(['proceso'])
    workers[0].respond({ id: workers[0].receivedRequests[0].id, kind: 'checked', misspelled: ['proceso'] })
    await firstCheck

    await expect(client.checkWords(['proceso'])).resolves.toEqual(new Set(['proceso']))
    expect(workers[0].receivedRequests).toHaveLength(1)
  })

  it('matches answers to their requests when they arrive out of order', async () => {
    const workers = startFakeWorkers()
    const client = await importFreshSpellingClient()

    const firstSuggestions = client.suggestCorrections('proceso')
    const secondSuggestions = client.suggestCorrections('usuario')
    const [firstRequest, secondRequest] = workers[0].receivedRequests
    workers[0].respond({ id: secondRequest.id, kind: 'suggested', suggestions: ['usuário'] })
    workers[0].respond({ id: firstRequest.id, kind: 'suggested', suggestions: ['processo'] })

    await expect(firstSuggestions).resolves.toEqual(['processo'])
    await expect(secondSuggestions).resolves.toEqual(['usuário'])
  })

  it('stops the worker and never starts another after a failure', async () => {
    const workers = startFakeWorkers()
    const client = await importFreshSpellingClient()

    const failedCheck = client.checkWords(['proceso'])
    workers[0].respond({ id: workers[0].receivedRequests[0].id, kind: 'failed' })

    await expect(failedCheck).resolves.toEqual(new Set())
    await expect(client.checkWords(['usuario'])).resolves.toEqual(new Set())
    expect(workers[0].terminate).toHaveBeenCalled()
    expect(workers).toHaveLength(1)
    expect(client.isSpellingEngineUnavailable()).toBe(true)
  })

  it('releases pending questions when the worker crashes', async () => {
    const workers = startFakeWorkers()
    const client = await importFreshSpellingClient()

    const pendingCheck = client.checkWords(['proceso'])
    workers[0].crash()

    await expect(pendingCheck).resolves.toEqual(new Set())
  })

  it('stops an idle worker and starts a new one for the next unknown word', async () => {
    vi.useFakeTimers()
    const workers = startFakeWorkers()
    const client = await importFreshSpellingClient()

    const firstCheck = client.checkWords(['proceso'])
    workers[0].respond({ id: workers[0].receivedRequests[0].id, kind: 'checked', misspelled: [] })
    await firstCheck
    vi.advanceTimersByTime(client.IDLE_WORKER_LIFETIME_MS)
    expect(workers[0].terminate).toHaveBeenCalled()

    void client.checkWords(['usuario'])
    expect(workers).toHaveLength(2)
    expect(client.isSpellingEngineUnavailable()).toBe(false)
  })
})
