import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'

import { fakeModeler, resetBpmnEditorFakes } from './test-support/bpmn-editor-fakes'
import { renderLoadedBpmnEditor, waitForEditorStatus } from './test-support/render-bpmn-editor'

vi.mock(
  'bpmn-js/lib/Modeler',
  async () => (await import('./test-support/bpmn-editor-fakes')).fakeBpmnModelerModule,
)

describe('useBpmnEditor reload', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    resetBpmnEditorFakes()
  })

  it('rebuilds the canvas from the version now stored in the browser', async () => {
    await renderLoadedBpmnEditor()
    await db.diagrams.update('diagram-1', {
      name: 'Versão da nuvem',
      bpmnXml: '<xml>cloud</xml>',
    })

    fireEvent.click(screen.getByRole('button', { name: 'reload' }))
    await waitForEditorStatus('ready')

    expect(fakeModeler.destroy).toHaveBeenCalledOnce()
    expect(fakeModeler.importXML).toHaveBeenLastCalledWith('<xml>cloud</xml>')
    expect(screen.getByTestId('name')).toHaveValue('Versão da nuvem')
  })
})
