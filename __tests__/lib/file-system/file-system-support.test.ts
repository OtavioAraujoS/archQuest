import { afterEach, describe, expect, it, vi } from 'vitest'

import { isFileSystemAccessSupported } from '@/lib/file-system/file-system-support'
import { installFilePickers } from './fake-file-handle'

describe('isFileSystemAccessSupported', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('is false without the file pickers, as in Firefox and Safari', () => {
    installFilePickers({})

    expect(isFileSystemAccessSupported()).toBe(false)
  })

  it('is false when only one of the pickers exists', () => {
    installFilePickers({ showOpenFilePicker: vi.fn() })

    expect(isFileSystemAccessSupported()).toBe(false)
  })

  it('is true when both pickers exist, as in Chromium browsers', () => {
    installFilePickers({ showOpenFilePicker: vi.fn(), showSaveFilePicker: vi.fn() })

    expect(isFileSystemAccessSupported()).toBe(true)
  })
})
