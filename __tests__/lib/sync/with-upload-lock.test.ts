import { afterEach, describe, expect, it, vi } from 'vitest'

import { UPLOAD_LOCK_NAME, withUploadLock } from '@/lib/sync/with-upload-lock'

type LockCallback = (lock: object | null) => Promise<unknown>

function installLockManager({ isHeldByAnotherTab }: { isHeldByAnotherTab: boolean }) {
  const request = vi.fn(
    (_name: string, _options: { ifAvailable: boolean }, callback: LockCallback) =>
      callback(isHeldByAnotherTab ? null : { name: UPLOAD_LOCK_NAME }),
  )
  vi.stubGlobal('navigator', { ...navigator, locks: { request } })
  return request
}

describe('withUploadLock', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('runs the upload directly when the browser has no Web Locks', async () => {
    vi.stubGlobal('navigator', { ...navigator, locks: undefined })

    await expect(withUploadLock(async () => 'uploaded')).resolves.toBe('uploaded')
  })

  it('runs the upload under the lock shared by every tab, without waiting for it', async () => {
    const request = installLockManager({ isHeldByAnotherTab: false })

    await expect(withUploadLock(async () => 'uploaded')).resolves.toBe('uploaded')
    expect(request).toHaveBeenCalledWith(
      UPLOAD_LOCK_NAME,
      { ifAvailable: true },
      expect.any(Function),
    )
  })

  it('skips the upload and fails when another tab is already uploading', async () => {
    installLockManager({ isHeldByAnotherTab: true })
    const uploadTask = vi.fn(async () => 'uploaded')

    await expect(withUploadLock(uploadTask)).rejects.toThrow(
      'Upload em progresso por outra instância',
    )
    expect(uploadTask).not.toHaveBeenCalled()
  })
})
