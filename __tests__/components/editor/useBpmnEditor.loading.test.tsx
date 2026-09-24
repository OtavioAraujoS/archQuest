import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'

import {
  fakeModeler,
  makeDiagramRecord,
  resetBpmnEditorFakes,
} from './test-support/bpmn-editor-fakes'
import {
  renderBpmnEditor,
  renderLoadedBpmnEditor,
  waitForEditorStatus,
} from './test-support/render-bpmn-editor'

vi.mock(
  'bpmn-js/lib/Modeler',
  async () => (await import('./test-support/bpmn-editor-fakes')).fakeBpmnModelerModule,
)

describe('useBpmnEditor loading', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    resetBpmnEditorFakes()
  })

  it('loads the diagram from the database and marks status as ready', async () => {
    await renderLoadedBpmnEditor()

    expect(screen.getByTestId('name')).toHaveValue('Processo original')
    expect(fakeModeler.importXML).toHaveBeenCalledWith('<xml>original</xml>')
    expect(fakeModeler.zoom).toHaveBeenCalledWith('fit-viewport')
  })

  it('generates the missing thumbnail on first open without touching updatedAt', async () => {
    await renderLoadedBpmnEditor()

    await waitFor(async () => {
      const openedDiagram = await db.diagrams.get('diagram-1')
      expect(openedDiagram?.thumbnail).toBe('<svg>saved</svg>')
      expect(openedDiagram?.updatedAt).toBe(1)
    })
  })

  it('keeps an existing thumbnail untouched', async () => {
    await db.diagrams.add(makeDiagramRecord({ thumbnail: '<svg>old</svg>' }))
    renderBpmnEditor('diagram-1')
    await waitForEditorStatus('ready')

    expect(fakeModeler.saveSVG).not.toHaveBeenCalled()
    await expect(db.diagrams.get('diagram-1')).resolves.toMatchObject({
      thumbnail: '<svg>old</svg>',
    })
  })

  it('keeps loading when the diagram does not exist', async () => {
    renderBpmnEditor('missing')

    await waitForEditorStatus('loading')
    expect(fakeModeler.importXML).not.toHaveBeenCalled()
  })

  it('destroys the modeler on unmount', async () => {
    const { unmount } = await renderLoadedBpmnEditor()

    unmount()

    expect(fakeModeler.destroy).toHaveBeenCalledTimes(1)
  })
})
