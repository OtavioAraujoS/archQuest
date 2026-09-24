import { beforeEach, describe, expect, it, vi } from 'vitest'

import { signOutOfThisDevice } from '@/lib/auth/sign-out-of-this-device'
import { db } from '@/lib/db'
import { makeAccountDiagram, makeGuestDiagram } from '../diagrams/diagram-fixtures'

const { signOut } = vi.hoisted(() => ({ signOut: vi.fn() }))

vi.mock('@/lib/auth/auth-actions', () => ({ signOut }))

describe('signOutOfThisDevice', () => {
  beforeEach(async () => {
    signOut.mockReset().mockResolvedValue(undefined)
    await db.diagrams.clear()
    await db.diagrams.bulkAdd([makeAccountDiagram(), makeGuestDiagram()])
  })

  it('signs out and leaves only the guest diagrams in this browser', async () => {
    await signOutOfThisDevice()

    expect(signOut).toHaveBeenCalledOnce()
    await expect(db.diagrams.get('account-1')).resolves.toBeUndefined()
    await expect(db.diagrams.get('guest-1')).resolves.toBeDefined()
  })

  it('keeps the account diagrams when the sign out fails', async () => {
    signOut.mockRejectedValue(new Error('Failed to fetch'))

    await expect(signOutOfThisDevice()).rejects.toThrow('Failed to fetch')
    await expect(db.diagrams.get('account-1')).resolves.toBeDefined()
  })
})
