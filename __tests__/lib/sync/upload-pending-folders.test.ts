import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { uploadPendingFolders } from '@/lib/sync/upload-pending-folders'
import { OWNER_ID } from '../diagrams/diagram-fixtures'
import { makeAccountFolder, makeGuestFolder } from '../folders/folder-fixtures'

const { upsertCloudFolder } = vi.hoisted(() => ({
  upsertCloudFolder: vi.fn(),
}))

vi.mock('@/lib/folders/cloud-folders', () => ({ upsertCloudFolder }))

describe('uploadPendingFolders', () => {
  beforeEach(async () => {
    await db.folders.clear()
    upsertCloudFolder.mockReset().mockResolvedValue(undefined)
  })

  it('uploads the dirty folders of the owner and marks them clean', async () => {
    const pendingFolder = makeAccountFolder({ dirty: true })
    await db.folders.bulkAdd([
      pendingFolder,
      makeAccountFolder({ id: 'clean-folder', dirty: false }),
      makeGuestFolder(),
    ])

    await uploadPendingFolders(OWNER_ID)

    expect(upsertCloudFolder).toHaveBeenCalledExactlyOnceWith(pendingFolder)
    await expect(db.folders.get('account-folder')).resolves.toMatchObject({
      dirty: false,
    })
  })

  it('stops and keeps the folder pending when the cloud refuses it', async () => {
    await db.folders.add(makeAccountFolder({ dirty: true }))
    upsertCloudFolder.mockRejectedValue(new Error('offline'))

    await expect(uploadPendingFolders(OWNER_ID)).rejects.toThrow('offline')
    await expect(db.folders.get('account-folder')).resolves.toMatchObject({
      dirty: true,
    })
  })
})
