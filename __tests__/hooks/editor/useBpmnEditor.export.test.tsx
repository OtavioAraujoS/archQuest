import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'

import {
  fakeExport,
  resetBpmnEditorFakes,
} from '../../components/editor/test-support/bpmn-editor-fakes'
import { renderLoadedBpmnEditor } from '../../components/editor/test-support/render-bpmn-editor'

vi.mock(
  'bpmn-js/lib/Modeler',
  async () =>
    (await import('../../components/editor/test-support/bpmn-editor-fakes'))
      .fakeBpmnModelerModule,
)
vi.mock(
  '@/lib/export',
  async () =>
    (await import('../../components/editor/test-support/bpmn-editor-fakes'))
      .fakeExport,
)

describe('useBpmnEditor export', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    resetBpmnEditorFakes()
  })

  it('exports the formatted diagram XML as a .bpmn file', async () => {
    await renderLoadedBpmnEditor()

    fireEvent.click(screen.getByText('export-bpmn'))

    await waitFor(() =>
      expect(fakeExport.downloadBpmnXml).toHaveBeenCalledWith(
        '<xml>saved</xml>',
        'Processo original',
      ),
    )
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
