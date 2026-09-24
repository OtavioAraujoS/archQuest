import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'

import { useCurrentDiagramOwnerId } from '@/lib/diagrams/diagram-owner'
import {
  listAccountDiagrams,
  listGuestDiagrams,
} from '@/lib/diagrams/diagram-lists'
import { pullAccountDiagrams } from '@/lib/diagrams/pull-account-diagrams'

export type CloudPullStatus = 'pulling' | 'pulled' | 'failed'

interface FinishedCloudPull {
  ownerId: string
  succeeded: boolean
}

function cloudPullStatusFor(
  ownerId: string | null,
  finishedPull: FinishedCloudPull | null,
): CloudPullStatus {
  if (finishedPull?.ownerId !== ownerId) return 'pulling'
  return finishedPull.succeeded ? 'pulled' : 'failed'
}

export function useLibraryDiagrams() {
  const ownerId = useCurrentDiagramOwnerId()
  const [finishedPull, setFinishedPull] = useState<FinishedCloudPull | null>(
    null,
  )

  const accountDiagrams = useLiveQuery(
    () => (ownerId ? listAccountDiagrams(ownerId) : Promise.resolve([])),
    [ownerId],
  )
  const guestDiagrams = useLiveQuery(listGuestDiagrams)

  useEffect(() => {
    if (!ownerId) return
    let isCancelled = false
    const finishPull = (succeeded: boolean) => {
      if (!isCancelled) setFinishedPull({ ownerId, succeeded })
    }
    pullAccountDiagrams(ownerId).then(
      () => finishPull(true),
      () => finishPull(false),
    )
    return () => {
      isCancelled = true
    }
  }, [ownerId])

  return {
    ownerId,
    accountDiagrams,
    guestDiagrams,
    cloudPullStatus: cloudPullStatusFor(ownerId, finishedPull),
  }
}
