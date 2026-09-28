import { db, type DiagramRecord } from '@/lib/db'

export async function moveGuestDiagramsToAccount(
  diagramIds: string[],
  ownerId: string,
) {
  await db.transaction('rw', db.diagrams, db.folders, async () => {
    const chosenDiagrams = await db.diagrams.bulkGet(diagramIds)
    const guestDiagrams = chosenDiagrams.filter(
      (diagram): diagram is DiagramRecord => diagram?.ownerId === null,
    )
    const guestDiagramIds = guestDiagrams.map((diagram) => diagram.id)
    const usedFolderIds = guestDiagrams.flatMap((diagram) =>
      diagram.folderId ? [diagram.folderId] : [],
    )
    await db.folders
      .where('id')
      .anyOf(usedFolderIds)
      .filter((folder) => folder.ownerId === null)
      .modify({ ownerId, dirty: true })
    await db.diagrams
      .where('id')
      .anyOf(guestDiagramIds)
      .modify({ ownerId, version: 0, publicSlug: null, dirty: true })
  })
}
