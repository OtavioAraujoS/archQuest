import { db, type FolderRecord } from '@/lib/db'
import { currentDiagramOwnerId } from '@/lib/diagrams/diagram-owner'
import {
  deleteCloudFolder,
  fetchAccountFolders,
} from '@/lib/folders/cloud-folders'

function foldersOwnedBy(ownerId: string | null) {
  return ownerId
    ? db.folders.where('ownerId').equals(ownerId)
    : db.folders.filter((folder) => folder.ownerId === null)
}

function byName(first: FolderRecord, second: FolderRecord) {
  return first.name.localeCompare(second.name, 'pt-BR', {
    sensitivity: 'base',
  })
}

async function updateCachedFolder(
  id: string,
  changesFor: (folder: FolderRecord) => Partial<FolderRecord>,
) {
  await db.transaction('rw', db.folders, async () => {
    const folder = await db.folders.get(id)
    if (folder) await db.folders.update(id, changesFor(folder))
  })
}

export async function listFoldersOf(ownerId: string | null) {
  return (await foldersOwnedBy(ownerId).toArray()).sort(byName)
}

export function listPendingFolderUploads(ownerId: string) {
  return foldersOwnedBy(ownerId)
    .filter((folder) => folder.dirty)
    .toArray()
}

export async function createFolder(name: string) {
  const now = Date.now()
  const ownerId = currentDiagramOwnerId()
  const folder: FolderRecord = {
    id: crypto.randomUUID(),
    name,
    createdAt: now,
    updatedAt: now,
    ownerId,
    dirty: ownerId !== null,
  }
  await db.folders.add(folder)
  return folder.id
}

export function renameFolder(id: string, name: string) {
  return updateCachedFolder(id, (folder) => ({
    name,
    updatedAt: Date.now(),
    dirty: folder.ownerId !== null,
  }))
}

export function markFolderUploaded(uploaded: FolderRecord) {
  return updateCachedFolder(uploaded.id, (current) => ({
    dirty: current.name !== uploaded.name,
  }))
}

export async function deleteFolder(id: string) {
  const folder = await db.folders.get(id)
  if (!folder) return
  if (folder.ownerId !== null) await deleteCloudFolder(id)
  await db.transaction('rw', db.diagrams, db.folders, async () => {
    await db.diagrams.where('folderId').equals(id).modify({ folderId: null })
    await db.folders.delete(id)
  })
}

export async function pullAccountFolders(ownerId: string) {
  const cloudFolders = await fetchAccountFolders()
  const cloudFolderIds = new Set(cloudFolders.map((folder) => folder.id))

  await db.transaction('rw', db.folders, async () => {
    const cachedFolders = await foldersOwnedBy(ownerId).toArray()
    const dirtyCachedIds = new Set(
      cachedFolders.filter((folder) => folder.dirty).map((folder) => folder.id),
    )
    const foldersDeletedElsewhereIds = cachedFolders
      .filter((folder) => !folder.dirty && !cloudFolderIds.has(folder.id))
      .map((folder) => folder.id)

    await db.folders.bulkPut(
      cloudFolders.filter((folder) => !dirtyCachedIds.has(folder.id)),
    )
    await db.folders.bulkDelete(foldersDeletedElsewhereIds)
  })
}
