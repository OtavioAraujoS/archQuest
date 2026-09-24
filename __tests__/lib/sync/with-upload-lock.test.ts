import { afterEach, describe, expect, it, vi } from 'vitest'

import { UPLOAD_LOCK_NAME, withUploadLock } from '@/lib/sync/with-upload-lock'

function installSerializingLockManager() {
  let lockQueue = Promise.resolve()
  const request = vi.fn((_name: string, task: () => Promise<unknown>) => {
    const taskRun = lockQueue.then(task)
    lockQueue = taskRun.then(
      () => undefined,
      () => undefined,
    )
    return taskRun
  })
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

  it('runs the upload under the lock shared by every tab', async () => {
    const request = installSerializingLockManager()

    await expect(withUploadLock(async () => 'uploaded')).resolves.toBe('uploaded')
    expect(request).toHaveBeenCalledWith(UPLOAD_LOCK_NAME, expect.any(Function))
  })

  it('never lets two uploads overlap', async () => {
    installSerializingLockManager()
    const uploadSteps: string[] = []
    const uploadNamed = (uploadName: string) => async () => {
      uploadSteps.push(`${uploadName} started`)
      await new Promise((resolve) => setTimeout(resolve, 10))
      uploadSteps.push(`${uploadName} finished`)
    }

    await Promise.all([withUploadLock(uploadNamed('first tab')), withUploadLock(uploadNamed('second tab'))])

    expect(uploadSteps).toEqual([
      'first tab started',
      'first tab finished',
      'second tab started',
      'second tab finished',
    ])
  })
})
