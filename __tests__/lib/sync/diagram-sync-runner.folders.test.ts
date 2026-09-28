import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { startDiagramSync } from '@/lib/sync/diagram-sync-runner'
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
  listPendingUploads: (await import('./sync-runner-harness')).syncRunnerFakes
    .listPendingUploads,
}))
vi.mock('@/lib/sync/upload-diagram', async () => ({
  uploadDiagram: (await import('./sync-runner-harness')).syncRunnerFakes
    .uploadDiagram,
}))
vi.mock('@/lib/sync/upload-pending-folders', async () => ({
  uploadPendingFolders: (await import('./sync-runner-harness')).syncRunnerFakes
    .uploadPendingFolders,
}))

describe('diagram sync runner folders', () => {
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

  it('uploads the pending folders before the diagrams that use them', async () => {
    givenPendingUploads([makeAccountDiagram({ dirty: true })])

    stopDiagramSync = startDiagramSync(OWNER_ID)
    await waitForUploadDebounce()

    expect(syncRunnerFakes.uploadPendingFolders).toHaveBeenCalledWith(OWNER_ID)
    expect(
      syncRunnerFakes.uploadPendingFolders.mock.invocationCallOrder[0],
    ).toBeLessThan(syncRunnerFakes.uploadDiagram.mock.invocationCallOrder[0]!)
  })

  it('retries the round when the folders could not be uploaded', async () => {
    syncRunnerFakes.uploadPendingFolders.mockRejectedValue(new Error('offline'))
    givenPendingUploads([makeAccountDiagram({ dirty: true })])

    stopDiagramSync = startDiagramSync(OWNER_ID)
    await waitForUploadDebounce()

    expect(syncRunnerFakes.uploadDiagram).not.toHaveBeenCalled()
  })
})
