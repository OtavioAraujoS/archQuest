import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  hasAnsweredGuestMigration,
  rememberGuestMigrationAnswer,
} from '@/lib/diagrams/guest-migration-answer'

describe('guest migration answer', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('is unanswered until remembered', () => {
    expect(hasAnsweredGuestMigration('owner-1')).toBe(false)

    rememberGuestMigrationAnswer('owner-1')

    expect(hasAnsweredGuestMigration('owner-1')).toBe(true)
  })

  it('is remembered per account', () => {
    rememberGuestMigrationAnswer('owner-1')

    expect(hasAnsweredGuestMigration('owner-2')).toBe(false)
  })

  it('treats blocked storage as unanswered without throwing', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })

    expect(() => rememberGuestMigrationAnswer('owner-1')).not.toThrow()
    expect(hasAnsweredGuestMigration('owner-1')).toBe(false)
  })
})
