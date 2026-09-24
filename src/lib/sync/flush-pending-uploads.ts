import { listPendingUploads } from '@/lib/diagrams/diagram-lists'
import { uploadDiagram } from '@/lib/sync/upload-diagram'
import { withUploadLock } from '@/lib/sync/with-upload-lock'

export const LOCK_RETRY_DELAY_MS = 500
export const MAX_LOCK_ATTEMPTS = 20

function waitBeforeRetry() {
  return new Promise((resolve) => setTimeout(resolve, LOCK_RETRY_DELAY_MS))
}

async function uploadEveryPendingDiagram(ownerId: string) {
  for (const diagram of await listPendingUploads(ownerId)) {
    try {
      await uploadDiagram(diagram)
    } catch {
      continue
    }
  }
}

export async function flushPendingUploads(ownerId: string): Promise<number> {
  for (let attempt = 1; attempt <= MAX_LOCK_ATTEMPTS; attempt++) {
    try {
      await withUploadLock(() => uploadEveryPendingDiagram(ownerId))
      break
    } catch {
      if (attempt < MAX_LOCK_ATTEMPTS) await waitBeforeRetry()
    }
  }
  return (await listPendingUploads(ownerId)).length
}
