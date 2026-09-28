import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { pullAccountFolders } from '@/lib/folders/cached-folders'
import { OWNER_ID } from '../diagrams/diagram-fixtures'
import { makeAccountFolder, makeGuestFolder } from './folder-fixtures'

const { fetchAccountFolders } = vi.hoisted(() => ({
  fetchAccountFolders: vi.fn(),
}))

vi.mock('@/lib/folders/cloud-folders', () => ({ fetchAccountFolders }))

const cloudFolder = makeAccountFolder({ name: 'Financeiro na nuvem' })

describe('pullAccountFolders', () => {
  beforeEach(async () => {
    await db.folders.clear()
    fetchAccountFolders.mockReset()
  })

  it('refreshes clean cached folders with the cloud version', async () => {
    await db.folders.add(makeAccountFolder())
    fetchAccountFolders.mockResolvedValue([cloudFolder])

    await pullAccountFolders(OWNER_ID)

    await expect(db.folders.get('account-folder')).resolves.toEqual(cloudFolder)
  })

  it('keeps a cached folder with changes not uploaded yet', async () => {
    await db.folders.add(makeAccountFolder({ dirty: true }))
    fetchAccountFolders.mockResolvedValue([cloudFolder])

    await pullAccountFolders(OWNER_ID)

    await expect(db.folders.get('account-folder')).resolves.toMatchObject({
      name: 'Financeiro',
      dirty: true,
    })
  })

  it('removes a clean folder deleted on another device', async () => {
    await db.folders.add(makeAccountFolder())
    fetchAccountFolders.mockResolvedValue([])

    await pullAccountFolders(OWNER_ID)

    await expect(db.folders.get('account-folder')).resolves.toBeUndefined()
  })

  it('never touches guest folders', async () => {
    await db.folders.add(makeGuestFolder())
    fetchAccountFolders.mockResolvedValue([])

    await pullAccountFolders(OWNER_ID)

    await expect(db.folders.get('guest-folder')).resolves.toEqual(
      makeGuestFolder(),
    )
  })
})
