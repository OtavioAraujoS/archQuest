import { db } from '@/lib/db'
import { fetchAccountDiagramRows } from '@/lib/diagrams/cloud-diagrams'
import { toCachedDiagramRecord } from '@/lib/diagrams/diagram-row-mapping'

export async function pullAccountDiagrams(ownerId: string) {
  const cloudDiagrams = (await fetchAccountDiagramRows()).map(toCachedDiagramRecord)
  const cloudDiagramIds = new Set(cloudDiagrams.map((diagram) => diagram.id))

  await db.transaction('rw', db.diagrams, async () => {
    const cachedDiagrams = await db.diagrams.where('ownerId').equals(ownerId).toArray()
    const dirtyCachedIds = new Set(
      cachedDiagrams.filter((diagram) => diagram.dirty).map((diagram) => diagram.id),
    )
    const diagramsDeletedElsewhereIds = cachedDiagrams
      .filter((diagram) => !diagram.dirty && !cloudDiagramIds.has(diagram.id))
      .map((diagram) => diagram.id)

    await db.diagrams.bulkPut(
      cloudDiagrams.filter((diagram) => !dirtyCachedIds.has(diagram.id)),
    )
    await db.diagrams.bulkDelete(diagramsDeletedElsewhereIds)
  })
}
