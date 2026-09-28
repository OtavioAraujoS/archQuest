import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { saveDiagramContent } = vi.hoisted(() => ({
  saveDiagramContent: vi.fn(),
}))

vi.mock('@/lib/diagrams/local-diagram-changes', () => ({ saveDiagramContent }))

import {
  AUTOSAVE_DEBOUNCE_MS,
  createDiagramAutosave,
} from '@/lib/diagrams/diagram-autosave'

function createModeler() {
  return {
    saveXML: vi.fn().mockResolvedValue({ xml: '<xml />' }),
    saveSVG: vi.fn().mockResolvedValue({
      svg: '<rect style="fill: var(--bpmn-shape-fill)"/>',
    }),
  }
}

describe('createDiagramAutosave', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    saveDiagramContent.mockReset().mockResolvedValue(undefined)
  })

  afterEach(() => vi.useRealTimers())

  it('saves once after the changes settle, with a light thumbnail', async () => {
    const onStateChange = vi.fn()
    const autosave = createDiagramAutosave(createModeler(), 'd1', onStateChange)

    autosave.scheduleSave()
    autosave.scheduleSave()
    await vi.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS)

    expect(saveDiagramContent).toHaveBeenCalledOnce()
    expect(saveDiagramContent).toHaveBeenCalledWith('d1', {
      bpmnXml: '<xml />',
      thumbnail: '<rect style="fill: #ffffff"/>',
    })
    expect(onStateChange.mock.calls).toEqual([
      ['pending'],
      ['pending'],
      ['saving'],
      ['saved'],
    ])
  })

  it('reports a failed save', async () => {
    saveDiagramContent.mockRejectedValue(new Error('quota'))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const onStateChange = vi.fn()
    const autosave = createDiagramAutosave(createModeler(), 'd1', onStateChange)

    autosave.scheduleSave()
    await vi.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS)

    expect(onStateChange).toHaveBeenLastCalledWith('failed')
  })

  it('drops a pending save when cancelled', async () => {
    const autosave = createDiagramAutosave(createModeler(), 'd1', vi.fn())

    autosave.scheduleSave()
    autosave.cancelPendingSave()
    await vi.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS)

    expect(saveDiagramContent).not.toHaveBeenCalled()
  })

  it('waits thirty seconds after the last change', async () => {
    const autosave = createDiagramAutosave(createModeler(), 'd1', vi.fn())

    autosave.scheduleSave()
    await vi.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS - 1)

    expect(AUTOSAVE_DEBOUNCE_MS).toBe(30_000)
    expect(saveDiagramContent).not.toHaveBeenCalled()
    expect(autosave.hasPendingSave()).toBe(true)
  })

  it('saves right away when asked to flush pending changes', async () => {
    const autosave = createDiagramAutosave(createModeler(), 'd1', vi.fn())

    autosave.scheduleSave()
    await autosave.flushPendingSave()
    await autosave.flushPendingSave()

    expect(saveDiagramContent).toHaveBeenCalledOnce()
    expect(autosave.hasPendingSave()).toBe(false)
  })

  it('captures the thumbnail right away, while the canvas is still on the page', async () => {
    const modeler = createModeler()
    const autosave = createDiagramAutosave(modeler, 'd1', vi.fn())

    autosave.scheduleSave()
    const flushing = autosave.flushPendingSave()

    expect(modeler.saveSVG).toHaveBeenCalledOnce()
    expect(autosave.isSaving()).toBe(true)
    await flushing
    expect(autosave.isSaving()).toBe(false)
  })

  it('has nothing pending once the scheduled save ran', async () => {
    const autosave = createDiagramAutosave(createModeler(), 'd1', vi.fn())

    autosave.scheduleSave()
    await vi.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS)

    expect(autosave.hasPendingSave()).toBe(false)
  })
})
