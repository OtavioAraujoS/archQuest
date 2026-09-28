import { db } from '@/lib/db'

export async function forgetAccountDiagrams() {
  await db.diagrams.filter((diagram) => diagram.ownerId !== null).delete()
  await db.folders.filter((folder) => folder.ownerId !== null).delete()
}
