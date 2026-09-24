import { db } from '@/lib/db'
import { deleteCloudDiagram } from '@/lib/diagrams/cloud-diagrams'

export async function deleteDiagram(id: string) {
  const diagram = await db.diagrams.get(id)
  if (!diagram) return
  const existsInCloud = diagram.ownerId !== null && diagram.version > 0
  if (existsInCloud) await deleteCloudDiagram(id)
  await db.diagrams.delete(id)
}
