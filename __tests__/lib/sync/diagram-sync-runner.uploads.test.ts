import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { startDiagramSync } from '@/lib/sync/diagram-sync-runner'
import { INITIAL_SYNC_STATE, useSyncStore } from '@/lib/sync/sync-store'
import { makeAccountDiagram, OWNER_ID } from '../diagrams/diagram-fixtures'
import {
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

describe('diagram sync runner uploads', () => {
  let stopDiagramSync = () => {}

  beforeEach(() => {
    vi.useFakeTimers()
    resetSyncRunnerFakes()
  })

  afterEach(() => {
    stopDiagramSync()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('uploads the pending diagrams of the owner after a short pause', async () => {
    const pendingDiagram = makeAccountDiagram({ dirty: true })
    givenPendingUploads([pendingDiagram])

    stopDiagramSync = startDiagramSync(OWNER_ID)
    expect(syncRunnerFakes.uploadDiagram).not.toHaveBeenCalled()
    await waitForUploadDebounce()

    expect(syncRunnerFakes.listPendingUploads).toHaveBeenCalledWith(OWNER_ID)
    expect(syncRunnerFakes.uploadDiagram).toHaveBeenCalledWith(pendingDiagram)
    expect(useSyncStore.getState()).toMatchObject({ isUploading: false, lastUploadFailed: false })
  })

  it('groups quick successive changes into a single upload round', async () => {
    givenPendingUploads([makeAccountDiagram({ dirty: true })])
    stopDiagramSync = startDiagramSync(OWNER_ID)

    syncRunnerFakes.emitPendingUploadsChanged()
    await vi.advanceTimersByTimeAsync(500)
    syncRunnerFakes.emitPendingUploadsChanged()
    await waitForUploadDebounce()

    expect(syncRunnerFakes.uploadDiagram).toHaveBeenCalledOnce()
  })

  it('remembers diagrams that are too large or in conflict', async () => {
    const hugeDiagram = makeAccountDiagram({ id: 'huge', dirty: true })
    const staleDiagram = makeAccountDiagram({ id: 'stale', dirty: true })
    givenPendingUploads([hugeDiagram, staleDiagram])
    syncRunnerFakes.uploadDiagram.mockImplementation(async (diagram) =>
      diagram.id === 'huge' ? 'too-large' : 'conflict',
    )

    stopDiagramSync = startDiagramSync(OWNER_ID)
    await waitForUploadDebounce()

    expect(useSyncStore.getState()).toMatchObject({
      tooLargeDiagramIds: ['huge'],
      conflictedDiagramIds: ['stale'],
    })
  })

  it('stops retrying a diagram in conflict until the conflict is resolved', async () => {
    const staleDiagram = makeAccountDiagram({ id: 'stale', dirty: true })
    givenPendingUploads([staleDiagram])
    syncRunnerFakes.uploadDiagram.mockResolvedValue('conflict')
    stopDiagramSync = startDiagramSync(OWNER_ID)
    await waitForUploadDebounce()

    syncRunnerFakes.emitPendingUploadsChanged()
    await waitForUploadDebounce()

    expect(syncRunnerFakes.uploadDiagram).toHaveBeenCalledOnce()
  })

  it('forgets a diagram that is no longer too large', async () => {
    const shrunkDiagram = makeAccountDiagram({ id: 'huge', dirty: true })
    givenPendingUploads([shrunkDiagram])
    syncRunnerFakes.uploadDiagram.mockResolvedValueOnce('too-large')
    stopDiagramSync = startDiagramSync(OWNER_ID)
    await waitForUploadDebounce()

    syncRunnerFakes.emitPendingUploadsChanged()
    await waitForUploadDebounce()

    expect(useSyncStore.getState().tooLargeDiagramIds).toEqual([])
  })

  it('stops watching and resets the status when stopped', async () => {
    givenPendingUploads([makeAccountDiagram({ dirty: true })])
    stopDiagramSync = startDiagramSync(OWNER_ID)

    stopDiagramSync()
    await waitForUploadDebounce()

    expect(syncRunnerFakes.stopWatchingPendingUploads).toHaveBeenCalledOnce()
    expect(syncRunnerFakes.uploadDiagram).not.toHaveBeenCalled()
    expect(useSyncStore.getState()).toEqual(INITIAL_SYNC_STATE)
  })
})
