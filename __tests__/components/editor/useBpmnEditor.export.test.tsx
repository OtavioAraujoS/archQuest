import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'

import { fakeExport, resetBpmnEditorFakes } from './test-support/bpmn-editor-fakes'
import { renderLoadedBpmnEditor } from './test-support/render-bpmn-editor'

vi.mock(
  'bpmn-js/lib/Modeler',
  async () => (await import('./test-support/bpmn-editor-fakes')).fakeBpmnModelerModule,
)
vi.mock(
  '@/lib/export',
  async () => (await import('./test-support/bpmn-editor-fakes')).fakeExport,
)

describe('useBpmnEditor export', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    resetBpmnEditorFakes()
  })

  it('exports the diagram as .bpmn via downloadBlob', async () => {
    await renderLoadedBpmnEditor()

    fireEvent.click(screen.getByText('export-bpmn'))

    await waitFor(() => expect(fakeExport.downloadBlob).toHaveBeenCalledTimes(1))
    const [bpmnBlob, filename] = fakeExport.downloadBlob.mock.calls[0]
    expect(bpmnBlob.type).toBe('application/xml')
    expect(filename).toBe('Processo original.bpmn')
  })

  it('delegates SVG and PNG export to the export helpers', async () => {
    await renderLoadedBpmnEditor()

    fireEvent.click(screen.getByText('export-svg'))
    fireEvent.click(screen.getByText('export-png'))

    await waitFor(() => {
      expect(fakeExport.exportSvg).toHaveBeenCalledWith(
        expect.anything(),
        'Processo original',
      )
      expect(fakeExport.exportPng).toHaveBeenCalledWith(
        expect.anything(),
        'Processo original',
      )
    })
  })
})
