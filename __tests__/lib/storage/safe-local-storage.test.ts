import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  readStoredValue,
  writeStoredValue,
} from '@/lib/storage/safe-local-storage'

describe('safe local storage', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  it('writes and reads back a value', () => {
    expect(writeStoredValue('archquest-test', 'saved')).toBe(true)
    expect(readStoredValue('archquest-test')).toBe('saved')
  })

  it('answers null for a missing key', () => {
    expect(readStoredValue('archquest-missing')).toBeNull()
  })

  it('logs and recovers when the browser blocks storage', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(readStoredValue('archquest-test')).toBeNull()
    expect(writeStoredValue('archquest-test', 'saved')).toBe(false)
    expect(consoleError).toHaveBeenCalledTimes(2)
  })
})
