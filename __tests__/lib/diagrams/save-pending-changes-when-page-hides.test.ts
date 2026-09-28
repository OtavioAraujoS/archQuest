import { afterEach, describe, expect, it, vi } from 'vitest'

import { savePendingChangesWhenPageHides } from '@/lib/diagrams/save-pending-changes-when-page-hides'

function setVisibility(state: DocumentVisibilityState) {
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue(state)
  document.dispatchEvent(new Event('visibilitychange'))
}

describe('savePendingChangesWhenPageHides', () => {
  afterEach(() => vi.restoreAllMocks())

  it('saves pending changes when the tab is hidden', () => {
    const autosave = { flushPendingSave: vi.fn().mockResolvedValue(undefined) }
    const stopSaving = savePendingChangesWhenPageHides(autosave)

    setVisibility('visible')
    setVisibility('hidden')
    stopSaving()
    setVisibility('hidden')

    expect(autosave.flushPendingSave).toHaveBeenCalledOnce()
  })
})
