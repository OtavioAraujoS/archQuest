import { BLANK_DIAGRAM_XML } from '@/lib/blank-diagram'
import { db, type DiagramRecord } from '@/lib/db'

export const BLANK_DIAGRAM_NAME = 'Novo diagrama'

export async function createDiagram(
  name = BLANK_DIAGRAM_NAME,
  bpmnXml = BLANK_DIAGRAM_XML,
) {
  const now = Date.now()
  const diagram: DiagramRecord = {
    id: crypto.randomUUID(),
    name,
    bpmnXml,
    createdAt: now,
    updatedAt: now,
  }
  await db.diagrams.add(diagram)
  return diagram.id
}
