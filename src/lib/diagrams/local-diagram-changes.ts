import { db, type DiagramRecord } from '@/lib/db'

type DiagramChanges = Partial<
  Pick<DiagramRecord, 'name' | 'bpmnXml' | 'thumbnail' | 'folderId'>
>

async function applyDiagramChanges(
  id: string,
  changes: DiagramChanges,
  { countsAsEdit }: { countsAsEdit: boolean },
) {
  await db.transaction('rw', db.diagrams, async () => {
    const diagram = await db.diagrams.get(id)
    if (!diagram) return
    await db.diagrams.update(id, {
      ...changes,
      ...(countsAsEdit ? { updatedAt: Date.now() } : {}),
      dirty: diagram.ownerId !== null,
    })
  })
}

export function saveDiagramContent(
  id: string,
  content: Required<Pick<DiagramChanges, 'bpmnXml' | 'thumbnail'>>,
) {
  return applyDiagramChanges(id, content, { countsAsEdit: true })
}

export function renameDiagram(id: string, name: string) {
  return applyDiagramChanges(id, { name }, { countsAsEdit: true })
}

export function moveDiagramToFolder(id: string, folderId: string | null) {
  return applyDiagramChanges(id, { folderId }, { countsAsEdit: false })
}

export function saveDiagramThumbnail(id: string, thumbnail: string) {
  return applyDiagramChanges(id, { thumbnail }, { countsAsEdit: false })
}
