import { useLiveQuery } from 'dexie-react-hooks'

import { useLatestAnswer } from '@/hooks/ui/useLatestAnswer'
import { useCurrentDiagramOwnerId } from '@/lib/diagrams/diagram-owner'
import {
  listAccountDiagrams,
  listGuestDiagrams,
} from '@/lib/diagrams/diagram-lists'
import { pullAccountDiagrams } from '@/lib/diagrams/pull-account-diagrams'
import { pullAccountFolders } from '@/lib/folders/cached-folders'
import type { CloudPullStatus } from '@/types/library'

function pullFromCloud(ownerId: string): Promise<CloudPullStatus> {
  if (!ownerId) return Promise.resolve('pulling')
  pullAccountFolders(ownerId).catch(() => undefined)
  return pullAccountDiagrams(ownerId).then(
    () => 'pulled',
    () => 'failed',
  )
}

export function useLibraryDiagrams() {
  const ownerId = useCurrentDiagramOwnerId()
  const cloudPull = useLatestAnswer(ownerId ?? '', pullFromCloud)

  const accountDiagrams = useLiveQuery(
    () => (ownerId ? listAccountDiagrams(ownerId) : Promise.resolve([])),
    [ownerId],
  )
  const guestDiagrams = useLiveQuery(listGuestDiagrams)

  return {
    ownerId,
    accountDiagrams,
    guestDiagrams,
    cloudPullStatus: cloudPull?.answer ?? 'pulling',
  }
}
