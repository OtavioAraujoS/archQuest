import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PublicDiagramView } from '@/components/viewer/PublicDiagramView'

const { fakeViewer, fakeExport } = vi.hoisted(() => ({
  fakeViewer: {
    importXML: vi.fn(),
    destroy: vi.fn(),
    zoom: vi.fn(),
    saveSVG: vi.fn(),
  },
  fakeExport: {
    downloadBpmnXml: vi.fn(),
    exportSvg: vi.fn(),
    exportPng: vi.fn(),
  },
}))

vi.mock('bpmn-js/lib/NavigatedViewer', () => ({
  default: vi.fn().mockImplementation(function FakeNavigatedViewer() {
    return {
      importXML: fakeViewer.importXML,
      destroy: fakeViewer.destroy,
      saveSVG: fakeViewer.saveSVG,
      get: () => ({ zoom: fakeViewer.zoom }),
    }
  }),
}))
vi.mock('@/lib/export', () => fakeExport)

const PUBLIC_DIAGRAM = {
  name: 'Reembolso de despesas',
  bpmn_xml: '<bpmn:definitions id="published" />',
  updated_at: '2026-09-24T10:00:00.000Z',
}

describe('PublicDiagramView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fakeViewer.importXML.mockResolvedValue(undefined)
  })

  it('draws the published XML read-only and fits it on screen', async () => {
    render(<PublicDiagramView diagram={PUBLIC_DIAGRAM} />)

    await waitFor(() =>
      expect(fakeViewer.zoom).toHaveBeenCalledWith('fit-viewport', 'auto'),
    )
    expect(fakeViewer.importXML).toHaveBeenCalledWith(
      '<bpmn:definitions id="published" />',
    )
  })

  it('shows the name and the last update, without any author', () => {
    render(<PublicDiagramView diagram={PUBLIC_DIAGRAM} />)

    expect(
      screen.getByRole('heading', { name: 'Reembolso de despesas' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Atualizado em .* · somente leitura/),
    ).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/@|autor/i)
  })

  it('downloads the .bpmn, SVG and PNG named after the diagram', () => {
    render(<PublicDiagramView diagram={PUBLIC_DIAGRAM} />)

    for (const exportLabel of ['Arquivo .bpmn', 'Imagem SVG', 'Imagem PNG']) {
      fireEvent.click(screen.getByRole('button', { name: /Baixar/ }))
      fireEvent.click(screen.getByRole('menuitem', { name: exportLabel }))
    }

    expect(fakeExport.downloadBpmnXml).toHaveBeenCalledWith(
      '<bpmn:definitions id="published" />',
      'Reembolso de despesas',
    )
    expect(fakeExport.exportSvg).toHaveBeenCalledWith(
      expect.anything(),
      'Reembolso de despesas',
    )
    expect(fakeExport.exportPng).toHaveBeenCalledWith(
      expect.anything(),
      'Reembolso de despesas',
    )
  })

  it('still offers the .bpmn download when the XML cannot be drawn', async () => {
    fakeViewer.importXML.mockRejectedValue(new Error('unparsable content'))

    render(<PublicDiagramView diagram={PUBLIC_DIAGRAM} />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ainda dá para baixar o arquivo .bpmn',
    )
  })

  it('releases the viewer when leaving the page', () => {
    const { unmount } = render(<PublicDiagramView diagram={PUBLIC_DIAGRAM} />)

    unmount()

    expect(fakeViewer.destroy).toHaveBeenCalledOnce()
  })
})
