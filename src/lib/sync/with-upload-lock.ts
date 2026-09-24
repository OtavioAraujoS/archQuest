export const UPLOAD_LOCK_NAME = 'archquest-diagram-upload'

export async function withUploadLock<T>(
  uploadTask: () => Promise<T>,
): Promise<T> {
  if (!navigator.locks) return uploadTask()

  const lock = await navigator.locks.request(
    UPLOAD_LOCK_NAME,
    { ifAvailable: true },
    async (lock) => {
      if (!lock) {
        return null
      }
      return uploadTask()
    },
  )

  if (lock === null) {
    throw new Error('Upload em progresso por outra instância')
  }

  return lock
}
