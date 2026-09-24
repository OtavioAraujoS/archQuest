import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  flushPendingUploads,
  LOCK_RETRY_DELAY_MS,
  MAX_LOCK_ATTEMPTS,
} from '@/lib/sync/flush-pending-uploads'
import { makeAccountDiagram, OWNER_ID } from '../diagrams/diagram-fixtures'

const { listPendingUploads, uploadDiagram, withUploadLock } = vi.hoisted(() => ({
  listPendingUploads: vi.fn(),
  uploadDiagram: vi.fn(),
  withUploadLock: vi.fn(),
}))

vi.mock('@/lib/diagrams/diagram-lists', () => ({ listPendingUploads }))
vi.mock('@/lib/sync/upload-diagram', () => ({ uploadDiagram }))
vi.mock('@/lib/sync/with-upload-lock', () => ({ withUploadLock }))

const FIRST_PENDING = makeAccountDiagram({ id: 'first', dirty: true })
const SECOND_PENDING = makeAccountDiagram({ id: 'second', dirty: true })

describe('flushPendingUploads', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    withUploadLock.mockImplementation((uploadTask: () => Promise<unknown>) => uploadTask())
    listPendingUploads.mockResolvedValueOnce([FIRST_PENDING, SECOND_PENDING]).mockResolvedValue([])
    uploadDiagram.mockResolvedValue('uploaded')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('uploads every pending diagram of the owner and reports none left', async () => {
    await expect(flushPendingUploads(OWNER_ID)).resolves.toBe(0)

    expect(listPendingUploads).toHaveBeenCalledWith(OWNER_ID)
    expect(uploadDiagram).toHaveBeenCalledWith(FIRST_PENDING)
    expect(uploadDiagram).toHaveBeenCalledWith(SECOND_PENDING)
  })

  it('keeps going after a failed upload and reports what is left', async () => {
    uploadDiagram.mockRejectedValueOnce(new Error('Failed to fetch'))
    listPendingUploads
      .mockReset()
      .mockResolvedValueOnce([FIRST_PENDING, SECOND_PENDING])
      .mockResolvedValue([FIRST_PENDING])

    await expect(flushPendingUploads(OWNER_ID)).resolves.toBe(1)
    expect(uploadDiagram).toHaveBeenCalledWith(SECOND_PENDING)
  })

  it('waits for another tab that holds the upload lock, then uploads', async () => {
    vi.useFakeTimers()
    withUploadLock
      .mockRejectedValueOnce(new Error('Upload em progresso por outra instância'))
      .mockImplementation((uploadTask: () => Promise<unknown>) => uploadTask())

    const remainingCount = flushPendingUploads(OWNER_ID)
    await vi.advanceTimersByTimeAsync(LOCK_RETRY_DELAY_MS)

    await expect(remainingCount).resolves.toBe(0)
    expect(withUploadLock).toHaveBeenCalledTimes(2)
  })

  it('gives up on the lock after a while and reports what is left', async () => {
    vi.useFakeTimers()
    withUploadLock.mockRejectedValue(new Error('Upload em progresso por outra instância'))
    listPendingUploads.mockReset().mockResolvedValue([FIRST_PENDING])

    const remainingCount = flushPendingUploads(OWNER_ID)
    await vi.advanceTimersByTimeAsync(LOCK_RETRY_DELAY_MS * MAX_LOCK_ATTEMPTS)

    await expect(remainingCount).resolves.toBe(1)
    expect(withUploadLock).toHaveBeenCalledTimes(MAX_LOCK_ATTEMPTS)
  })
})
