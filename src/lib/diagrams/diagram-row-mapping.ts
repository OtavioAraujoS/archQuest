import type { DiagramRecord } from '@/lib/db'
import type { DiagramRow } from '@/lib/supabase/database-types'

export function toCachedDiagramRecord(row: DiagramRow): DiagramRecord {
  return {
    id: row.id,
    name: row.name,
    bpmnXml: row.bpmn_xml,
    thumbnail: row.thumbnail ?? undefined,
    createdAt: Date.parse(row.created_at),
    updatedAt: Date.parse(row.updated_at),
    ownerId: row.owner_id,
    version: row.version,
    publicSlug: row.public_slug,
    dirty: false,
  }
}
