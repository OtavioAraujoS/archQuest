import { db } from '@/lib/db'
import { fetchCloudDiagramRow } from '@/lib/diagrams/cloud-diagrams'
import { toCachedDiagramRecord } from '@/lib/diagrams/diagram-row-mapping'
import { useSyncStore } from '@/lib/sync/sync-store'

export type CloudVersionOutcome = 'loaded' | 'deleted-in-cloud'

function forgetConflict(id: string) {
  useSyncStore.setState((state) => ({
    conflictedDiagramIds: state.conflictedDiagramIds.filter(
      (conflictedId) => conflictedId !== id,
    ),
  }))
}

export async function keepLocalVersion(id: string) {
  const cloudRow = await fetchCloudDiagramRow(id)
  forgetConflict(id)
  await db.diagrams.update(id, {
    version: cloudRow?.version ?? 0,
    publicSlug: cloudRow?.public_slug ?? null,
    dirty: true,
  })
}

export async function loadCloudVersion(id: string): Promise<CloudVersionOutcome> {
  const cloudRow = await fetchCloudDiagramRow(id)
  if (cloudRow) await db.diagrams.put(toCachedDiagramRecord(cloudRow))
  else await db.diagrams.delete(id)
  forgetConflict(id)
  return cloudRow ? 'loaded' : 'deleted-in-cloud'
}
