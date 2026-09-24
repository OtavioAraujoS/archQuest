import { liveQuery } from 'dexie'

import { listPendingUploads } from '@/lib/diagrams/diagram-lists'
import { INITIAL_SYNC_STATE, useSyncStore } from '@/lib/sync/sync-store'
import { uploadDiagram } from '@/lib/sync/upload-diagram'
import { withUploadLock } from '@/lib/sync/with-upload-lock'

export const UPLOAD_DEBOUNCE_MS = 1000
export const FIRST_RETRY_DELAY_MS = 2000
export const MAX_RETRY_DELAY_MS = 60_000

export function startDiagramSync(ownerId: string): () => void {
  let isStopped = false
  let isUploadRoundRunning = false
  let isAnotherRoundRequested = false
  let retryDelayMs = FIRST_RETRY_DELAY_MS
  let scheduledRoundTimer: ReturnType<typeof setTimeout> | undefined

  function scheduleUploadRound(delayMs: number) {
    clearTimeout(scheduledRoundTimer)
    scheduledRoundTimer = setTimeout(() => void runUploadRound(), delayMs)
  }

  async function uploadPendingDiagrams() {
    const { conflictedDiagramIds } = useSyncStore.getState()
    const pendingDiagrams = (await listPendingUploads(ownerId)).filter(
      (diagram) => !conflictedDiagramIds.includes(diagram.id),
    )
    const tooLargeDiagramIds: string[] = []
    const newlyConflictedIds: string[] = []
    let hasFailedUpload = false
    for (const diagram of pendingDiagrams) {
      if (isStopped) return
      try {
        const outcome = await uploadDiagram(diagram)
        if (outcome === 'too-large') tooLargeDiagramIds.push(diagram.id)
        if (outcome === 'conflict') newlyConflictedIds.push(diagram.id)
      } catch {
        hasFailedUpload = true
      }
    }
    useSyncStore.setState((state) => ({
      tooLargeDiagramIds,
      conflictedDiagramIds: [...state.conflictedDiagramIds, ...newlyConflictedIds],
    }))
    if (hasFailedUpload) throw new Error('Some pending diagrams could not be uploaded')
  }

  async function runUploadRound() {
    if (isStopped || !navigator.onLine) return
    if (isUploadRoundRunning) {
      isAnotherRoundRequested = true
      return
    }
    isUploadRoundRunning = true
    useSyncStore.setState({ isUploading: true })
    try {
      do {
        isAnotherRoundRequested = false
        await withUploadLock(uploadPendingDiagrams)
      } while (isAnotherRoundRequested && !isStopped)
      retryDelayMs = FIRST_RETRY_DELAY_MS
      if (!isStopped) useSyncStore.setState({ lastUploadFailed: false })
    } catch {
      if (!isStopped) {
        useSyncStore.setState({ lastUploadFailed: true })
        scheduleUploadRound(retryDelayMs)
        retryDelayMs = Math.min(retryDelayMs * 2, MAX_RETRY_DELAY_MS)
      }
    } finally {
      isUploadRoundRunning = false
      if (!isStopped) useSyncStore.setState({ isUploading: false })
    }
  }

  function followNetworkStatus() {
    useSyncStore.setState({ isOnline: navigator.onLine })
    if (!navigator.onLine) return
    retryDelayMs = FIRST_RETRY_DELAY_MS
    scheduleUploadRound(0)
  }

  useSyncStore.setState({ ...INITIAL_SYNC_STATE, isOnline: navigator.onLine })
  window.addEventListener('online', followNetworkStatus)
  window.addEventListener('offline', followNetworkStatus)
  const pendingUploadsSubscription = liveQuery(() => listPendingUploads(ownerId)).subscribe({
    next: () => scheduleUploadRound(UPLOAD_DEBOUNCE_MS),
    error: () => useSyncStore.setState({ lastUploadFailed: true }),
  })

  return () => {
    isStopped = true
    clearTimeout(scheduledRoundTimer)
    pendingUploadsSubscription.unsubscribe()
    window.removeEventListener('online', followNetworkStatus)
    window.removeEventListener('offline', followNetworkStatus)
    useSyncStore.setState(INITIAL_SYNC_STATE)
  }
}
