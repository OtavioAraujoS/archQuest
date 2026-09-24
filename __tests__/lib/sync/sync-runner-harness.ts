import { vi } from 'vitest'

import type { DiagramRecord } from '@/lib/db'

export const syncRunnerFakes = {
  listPendingUploads: vi.fn(),
  uploadDiagram: vi.fn(),
  emitPendingUploadsChanged: () => {},
  stopWatchingPendingUploads: vi.fn(),
}

export async function mockDexieLiveQuery(importOriginal: () => Promise<unknown>) {
  const dexieModule = (await importOriginal()) as Record<string, unknown>
  return {
    ...dexieModule,
    liveQuery: () => ({
      subscribe: ({ next }: { next: () => void }) => {
        syncRunnerFakes.emitPendingUploadsChanged = next
        next()
        return { unsubscribe: syncRunnerFakes.stopWatchingPendingUploads }
      },
    }),
  }
}

export function givenPendingUploads(pendingDiagrams: DiagramRecord[]) {
  syncRunnerFakes.listPendingUploads.mockResolvedValue(pendingDiagrams)
}

export function givenNetworkIsOnline(isOnline: boolean) {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(isOnline)
}

export function changeNetworkTo(isOnline: boolean) {
  givenNetworkIsOnline(isOnline)
  window.dispatchEvent(new Event(isOnline ? 'online' : 'offline'))
}

export async function waitForUploadDebounce() {
  const { UPLOAD_DEBOUNCE_MS } = await import('@/lib/sync/diagram-sync-runner')
  await vi.advanceTimersByTimeAsync(UPLOAD_DEBOUNCE_MS)
}

export function resetSyncRunnerFakes() {
  vi.clearAllMocks()
  syncRunnerFakes.listPendingUploads.mockResolvedValue([])
  syncRunnerFakes.uploadDiagram.mockResolvedValue('uploaded')
  givenNetworkIsOnline(true)
}
