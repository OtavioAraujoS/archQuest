import { db } from '@/lib/db'
import { setCloudPublicSlug } from '@/lib/diagrams/cloud-diagram-sharing'
import { createPublicSlug } from '@/lib/sharing/public-slug'

async function storePublicSlug(id: string, publicSlug: string | null) {
  const storedSlug = await setCloudPublicSlug(id, publicSlug)
  await db.diagrams.update(id, { publicSlug: storedSlug })
  return storedSlug
}

export function publishDiagram(id: string) {
  return storePublicSlug(id, createPublicSlug())
}

export async function unpublishDiagram(id: string) {
  await storePublicSlug(id, null)
}
