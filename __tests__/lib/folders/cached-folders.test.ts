import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import {
  createFolder,
  deleteFolder,
  listFoldersOf,
  listPendingFolderUploads,
  markFolderUploaded,
  renameFolder,
} from '@/lib/folders/cached-folders'
import { makeAccountDiagram, OWNER_ID } from '../diagrams/diagram-fixtures'
import {
  signInAsDiagramOwner,
  signOutDiagramOwner,
} from '../diagrams/sign-in-as-owner'
import { makeAccountFolder, makeGuestFolder } from './folder-fixtures'

const { deleteCloudFolder } = vi.hoisted(() => ({
  deleteCloudFolder: vi.fn(),
}))

vi.mock('@/lib/folders/cloud-folders', () => ({ deleteCloudFolder }))

describe('cached folders', () => {
  beforeEach(async () => {
    await db.folders.clear()
    await db.diagrams.clear()
    deleteCloudFolder.mockReset().mockResolvedValue(undefined)
  })

  afterEach(signOutDiagramOwner)

  it('lists the folders of one owner sorted by name', async () => {
    await db.folders.bulkAdd([
      makeAccountFolder({ id: 'b', name: 'Vendas' }),
      makeAccountFolder({ id: 'a', name: 'compras' }),
      makeGuestFolder(),
    ])

    const names = (await listFoldersOf(OWNER_ID)).map((folder) => folder.name)

    expect(names).toEqual(['compras', 'Vendas'])
    await expect(listFoldersOf(null)).resolves.toEqual([makeGuestFolder()])
  })

  it('creates a guest folder that never waits for upload', async () => {
    const folderId = await createFolder('Rascunhos')

    await expect(db.folders.get(folderId)).resolves.toMatchObject({
      name: 'Rascunhos',
      ownerId: null,
      dirty: false,
    })
  })

  it('creates an account folder pending upload', async () => {
    signInAsDiagramOwner()

    const folderId = await createFolder('Financeiro')

    await expect(listPendingFolderUploads(OWNER_ID)).resolves.toEqual([
      expect.objectContaining({ id: folderId, ownerId: OWNER_ID }),
    ])
  })

  it('renames an account folder and marks it for upload', async () => {
    await db.folders.add(makeAccountFolder())

    await renameFolder('account-folder', 'Contas')

    await expect(db.folders.get('account-folder')).resolves.toMatchObject({
      name: 'Contas',
      dirty: true,
    })
  })

  it('keeps a folder dirty when it was renamed during the upload', async () => {
    const uploaded = makeAccountFolder({ dirty: true })
    await db.folders.add({ ...uploaded, name: 'Renomeada depois' })

    await markFolderUploaded(uploaded)

    await expect(db.folders.get('account-folder')).resolves.toMatchObject({
      dirty: true,
    })
  })

  it('marks a folder clean once its upload matches the cache', async () => {
    const uploaded = makeAccountFolder({ dirty: true })
    await db.folders.add(uploaded)

    await markFolderUploaded(uploaded)

    await expect(db.folders.get('account-folder')).resolves.toMatchObject({
      dirty: false,
    })
  })

  it('deletes an account folder and releases its diagrams', async () => {
    await db.folders.add(makeAccountFolder())
    await db.diagrams.add(makeAccountDiagram({ folderId: 'account-folder' }))

    await deleteFolder('account-folder')

    expect(deleteCloudFolder).toHaveBeenCalledWith('account-folder')
    await expect(db.folders.get('account-folder')).resolves.toBeUndefined()
    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({
      folderId: null,
    })
  })

  it('deletes a guest folder without touching the cloud', async () => {
    await db.folders.add(makeGuestFolder())

    await deleteFolder('guest-folder')

    expect(deleteCloudFolder).not.toHaveBeenCalled()
    await expect(db.folders.get('guest-folder')).resolves.toBeUndefined()
  })

  it('keeps the folder when the cloud delete fails', async () => {
    await db.folders.add(makeAccountFolder())
    deleteCloudFolder.mockRejectedValue(new Error('offline'))

    await expect(deleteFolder('account-folder')).rejects.toThrow('offline')
    await expect(db.folders.get('account-folder')).resolves.toBeDefined()
  })
})
