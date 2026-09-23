import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'

import { fakeModeler, resetBpmnEditorFakes } from './test-support/bpmn-editor-fakes'
import { renderLoadedBpmnEditor } from './test-support/render-bpmn-editor'

vi.mock(
  'bpmn-js/lib/Modeler',
  async () => (await import('./test-support/bpmn-editor-fakes')).fakeBpmnModelerModule,
)

const AUTOSAVE_DEBOUNCE_MS = 800

describe('useBpmnEditor persistence', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    resetBpmnEditorFakes()
  })

  afterEach(() => vi.useRealTimers())

  it('persists a renamed diagram to the database', async () => {
    await renderLoadedBpmnEditor()

    fireEvent.change(screen.getByTestId('name'), {
      target: { value: 'Novo nome' },
    })

    await waitFor(async () => {
      const updatedDiagram = await db.diagrams.get('diagram-1')
      expect(updatedDiagram?.name).toBe('Novo nome')
    })
  })

  it('autosaves after the diagram changes, debounced', async () => {
    await renderLoadedBpmnEditor()

    vi.useFakeTimers()
    fakeModeler.triggerDiagramChange?.()
    await vi.advanceTimersByTimeAsync(AUTOSAVE_DEBOUNCE_MS)
    vi.useRealTimers()

    await waitFor(async () => {
      const updatedDiagram = await db.diagrams.get('diagram-1')
      expect(updatedDiagram?.bpmnXml).toBe('<xml>saved</xml>')
      expect(updatedDiagram?.thumbnail).toBe('<svg>saved</svg>')
    })
  })
})
