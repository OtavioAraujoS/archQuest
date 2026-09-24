import { useAuthStore } from '@/lib/auth/auth-store'
import { currentDiagramOwnerId } from '@/lib/diagrams/diagram-owner'
import { startDiagramSync } from '@/lib/sync/diagram-sync-runner'

export function startDiagramSyncWhileSignedIn(): () => void {
  let syncedOwnerId: string | null = null
  let stopOwnerSync = () => {}

  function followSignedInOwner() {
    const ownerId = currentDiagramOwnerId()
    if (ownerId === syncedOwnerId) return
    stopOwnerSync()
    stopOwnerSync = ownerId ? startDiagramSync(ownerId) : () => {}
    syncedOwnerId = ownerId
  }

  followSignedInOwner()
  const stopFollowingAuth = useAuthStore.subscribe(followSignedInOwner)

  return () => {
    stopFollowingAuth()
    stopOwnerSync()
  }
}
