import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  FIRST_RETRY_DELAY_MS,
  MAX_RETRY_DELAY_MS,
  startDiagramSync,
} from '@/lib/sync/diagram-sync-runner'
import { useSyncStore } from '@/lib/sync/sync-store'
import { makeAccountDiagram, OWNER_ID } from '../diagrams/diagram-fixtures'
import {
  changeNetworkTo,
  givenNetworkIsOnline,
  givenPendingUploads,
  resetSyncRunnerFakes,
  syncRunnerFakes,
  waitForUploadDebounce,
} from './sync-runner-harness'

vi.mock('dexie', async (importOriginal) =>
  (await import('./sync-runner-harness')).mockDexieLiveQuery(importOriginal),
)
vi.mock('@/lib/diagrams/diagram-lists', async () => ({
  listPendingUploads: (await import('./sync-runner-harness')).syncRunnerFakes.listPendingUploads,
}))
vi.mock('@/lib/sync/upload-diagram', async () => ({
  uploadDiagram: (await import('./sync-runner-harness')).syncRunnerFakes.uploadDiagram,
}))

describe('diagram sync runner network handling', () => {
  let stopDiagramSync = () => {}

  beforeEach(() => {
    vi.useFakeTimers()
    resetSyncRunnerFakes()
    givenPendingUploads([makeAccountDiagram({ dirty: true })])
  })

  afterEach(() => {
    stopDiagramSync()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('waits offline and uploads as soon as the connection returns', async () => {
    givenNetworkIsOnline(false)
    stopDiagramSync = startDiagramSync(OWNER_ID)
    await waitForUploadDebounce()

    expect(useSyncStore.getState().isOnline).toBe(false)
    expect(syncRunnerFakes.uploadDiagram).not.toHaveBeenCalled()

    changeNetworkTo(true)
    await vi.advanceTimersByTimeAsync(0)

    expect(useSyncStore.getState().isOnline).toBe(true)
    expect(syncRunnerFakes.uploadDiagram).toHaveBeenCalledOnce()
  })

  it('reports going offline', async () => {
    stopDiagramSync = startDiagramSync(OWNER_ID)

    changeNetworkTo(false)

    expect(useSyncStore.getState().isOnline).toBe(false)
  })

  it('retries a failed upload after a pause and clears the failure', async () => {
    syncRunnerFakes.uploadDiagram.mockRejectedValueOnce(new Error('Failed to fetch'))
    stopDiagramSync = startDiagramSync(OWNER_ID)
    await waitForUploadDebounce()

    expect(useSyncStore.getState().lastUploadFailed).toBe(true)

    await vi.advanceTimersByTimeAsync(FIRST_RETRY_DELAY_MS)

    expect(syncRunnerFakes.uploadDiagram).toHaveBeenCalledTimes(2)
    expect(useSyncStore.getState().lastUploadFailed).toBe(false)
  })

  it('doubles the pause between failed retries', async () => {
    syncRunnerFakes.uploadDiagram.mockRejectedValue(new Error('Failed to fetch'))
    stopDiagramSync = startDiagramSync(OWNER_ID)
    await waitForUploadDebounce()
    await vi.advanceTimersByTimeAsync(FIRST_RETRY_DELAY_MS)
    expect(syncRunnerFakes.uploadDiagram).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(FIRST_RETRY_DELAY_MS * 2 - 1)
    expect(syncRunnerFakes.uploadDiagram).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(1)
    expect(syncRunnerFakes.uploadDiagram).toHaveBeenCalledTimes(3)
  })

  it('never waits longer than the maximum pause between retries', async () => {
    syncRunnerFakes.uploadDiagram.mockRejectedValue(new Error('Failed to fetch'))
    stopDiagramSync = startDiagramSync(OWNER_ID)
    await waitForUploadDebounce()
    await vi.advanceTimersByTimeAsync(10 * MAX_RETRY_DELAY_MS)
    const attemptsSoFar = syncRunnerFakes.uploadDiagram.mock.calls.length

    await vi.advanceTimersByTimeAsync(MAX_RETRY_DELAY_MS)

    expect(syncRunnerFakes.uploadDiagram).toHaveBeenCalledTimes(attemptsSoFar + 1)
  })

  it('retries right away when the connection returns after a failure', async () => {
    syncRunnerFakes.uploadDiagram.mockRejectedValueOnce(new Error('Failed to fetch'))
    stopDiagramSync = startDiagramSync(OWNER_ID)
    await waitForUploadDebounce()

    changeNetworkTo(true)
    await vi.advanceTimersByTimeAsync(0)

    expect(syncRunnerFakes.uploadDiagram).toHaveBeenCalledTimes(2)
  })
})
