export function createSpellingWorker(): Worker | null {
  if (typeof Worker === 'undefined') return null

  try {
    return new Worker(new URL('./spelling-worker.ts', import.meta.url), {
      type: 'module',
    })
  } catch (error) {
    console.error('Failed to start the spelling worker', error)
    return null
  }
}
