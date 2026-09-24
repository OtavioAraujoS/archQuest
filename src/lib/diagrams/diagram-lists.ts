import { db, type DiagramRecord } from '@/lib/db'

export function listAccountDiagrams(ownerId: string): Promise<DiagramRecord[]> {
  return db.diagrams.where('ownerId').equals(ownerId).reverse().sortBy('updatedAt')
}

export function listGuestDiagrams(): Promise<DiagramRecord[]> {
  return db.diagrams
    .orderBy('updatedAt')
    .reverse()
    .filter((diagram) => diagram.ownerId === null)
    .toArray()
}
