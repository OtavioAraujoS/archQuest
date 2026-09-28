interface FlushableAutosave {
  flushPendingSave(): Promise<void>
}

export function savePendingChangesWhenPageHides(autosave: FlushableAutosave) {
  function saveWhenHidden() {
    if (document.visibilityState === 'hidden') {
      void autosave.flushPendingSave()
    }
  }

  document.addEventListener('visibilitychange', saveWhenHidden)
  return () => document.removeEventListener('visibilitychange', saveWhenHidden)
}
