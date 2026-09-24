import { db, type DiagramRecord } from '@/lib/db'

export async function moveGuestDiagramsToAccount(diagramIds: string[], ownerId: string) {
  await db.transaction('rw', db.diagrams, async () => {
    const chosenDiagrams = await db.diagrams.bulkGet(diagramIds)
    const guestDiagramIds = chosenDiagrams
      .filter((diagram): diagram is DiagramRecord => diagram?.ownerId === null)
      .map((diagram) => diagram.id)
    await db.diagrams
      .where('id')
      .anyOf(guestDiagramIds)
      .modify({ ownerId, version: 0, publicSlug: null, dirty: true })
  })
}
