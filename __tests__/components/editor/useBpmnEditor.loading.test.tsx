import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'

import { fakeModeler, resetBpmnEditorFakes } from './test-support/bpmn-editor-fakes'
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
