import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { deleteDiagram } from '@/lib/diagrams/delete-diagram'
import { makeAccountDiagram, makeGuestDiagram } from './diagram-fixtures'

const { deleteCloudDiagram } = vi.hoisted(() => ({ deleteCloudDiagram: vi.fn() }))

vi.mock('@/lib/diagrams/cloud-diagrams', () => ({ deleteCloudDiagram }))

describe('deleteDiagram', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    deleteCloudDiagram.mockReset()
  })

  it('deletes a guest diagram only locally', async () => {
    await db.diagrams.add(makeGuestDiagram())

    await deleteDiagram('guest-1')

    expect(deleteCloudDiagram).not.toHaveBeenCalled()
    await expect(db.diagrams.get('guest-1')).resolves.toBeUndefined()
  })

  it('deletes an uploaded account diagram from the cloud and the cache', async () => {
    await db.diagrams.add(makeAccountDiagram())

    await deleteDiagram('account-1')

    expect(deleteCloudDiagram).toHaveBeenCalledWith('account-1')
    await expect(db.diagrams.get('account-1')).resolves.toBeUndefined()
  })

  it('keeps the cached copy when the cloud delete fails', async () => {
    await db.diagrams.add(makeAccountDiagram())
    deleteCloudDiagram.mockRejectedValue(new Error('offline'))

    await expect(deleteDiagram('account-1')).rejects.toThrow('offline')
    await expect(db.diagrams.get('account-1')).resolves.toBeDefined()
  })

  it('skips the cloud for an account diagram never uploaded', async () => {
    await db.diagrams.add(makeAccountDiagram({ version: 0, dirty: true }))

    await deleteDiagram('account-1')

    expect(deleteCloudDiagram).not.toHaveBeenCalled()
    await expect(db.diagrams.get('account-1')).resolves.toBeUndefined()
  })
})
