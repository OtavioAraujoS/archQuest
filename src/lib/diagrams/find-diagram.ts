import { db, type DiagramRecord } from '@/lib/db'
import { fetchCloudDiagramRow } from '@/lib/diagrams/cloud-diagrams'
import { currentDiagramOwnerId } from '@/lib/diagrams/diagram-owner'
import { toCachedDiagramRecord } from '@/lib/diagrams/diagram-row-mapping'

export async function findDiagram(id: string): Promise<DiagramRecord | undefined> {
  const cachedDiagram = await db.diagrams.get(id)
  if (cachedDiagram || currentDiagramOwnerId() === null) return cachedDiagram

  const cloudRow = await fetchCloudDiagramRow(id)
  if (!cloudRow) return undefined
  const cloudDiagram = toCachedDiagramRecord(cloudRow)
  await db.diagrams.put(cloudDiagram)
  return cloudDiagram
}
