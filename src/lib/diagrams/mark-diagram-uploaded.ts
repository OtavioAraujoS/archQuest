import { db, type DiagramRecord } from '@/lib/db'
import type { DiagramRow } from '@/lib/supabase/database-types'

function hasSameContent(current: DiagramRecord, uploaded: DiagramRecord) {
  return (
    current.name === uploaded.name &&
    current.bpmnXml === uploaded.bpmnXml &&
    current.thumbnail === uploaded.thumbnail
  )
}

export async function markDiagramUploaded(uploaded: DiagramRecord, cloudRow: DiagramRow) {
  await db.transaction('rw', db.diagrams, async () => {
    const current = await db.diagrams.get(uploaded.id)
    if (!current) return
    await db.diagrams.update(uploaded.id, {
      version: cloudRow.version,
      publicSlug: cloudRow.public_slug,
      dirty: !hasSameContent(current, uploaded),
    })
  })
}
