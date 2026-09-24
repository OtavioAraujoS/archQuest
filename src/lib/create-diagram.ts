import { BLANK_DIAGRAM_XML } from '@/lib/blank-diagram'
import { db, GUEST_SYNC_FIELDS, type DiagramRecord } from '@/lib/db'
import { currentDiagramOwnerId } from '@/lib/diagrams/diagram-owner'

export const BLANK_DIAGRAM_NAME = 'Novo diagrama'

export async function createDiagram(
  name = BLANK_DIAGRAM_NAME,
  bpmnXml = BLANK_DIAGRAM_XML,
) {
  const now = Date.now()
  const ownerId = currentDiagramOwnerId()
  const diagram: DiagramRecord = {
    id: crypto.randomUUID(),
    name,
    bpmnXml,
    createdAt: now,
    updatedAt: now,
    ...GUEST_SYNC_FIELDS,
    ownerId,
    dirty: ownerId !== null,
  }
  await db.diagrams.add(diagram)
  return diagram.id
}
