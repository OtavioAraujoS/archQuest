import { render, screen, waitFor } from '@testing-library/react'
import type Viewer from 'bpmn-js/lib/Viewer'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useReadOnlyDiagramViewer } from '@/hooks/viewer/useReadOnlyDiagramViewer'

const fakeViewer = {
  importXML: vi.fn(),
  destroy: vi.fn(),
  zoom: vi.fn(),
  options: undefined as Record<string, unknown> | undefined,
}

const FakeViewer = vi.fn().mockImplementation(function FakeViewer(
  options: Record<string, unknown>,
) {
  fakeViewer.options = options
  return {
    importXML: fakeViewer.importXML,
    destroy: fakeViewer.destroy,
    get: () => ({ zoom: fakeViewer.zoom }),
  }
}) as unknown as typeof Viewer

function ViewerHarness({ bpmnXml }: Readonly<{ bpmnXml: string }>) {
  const { containerRef, hasRenderFailed } = useReadOnlyDiagramViewer(
    FakeViewer,
    bpmnXml,
  )
  return (
    <div ref={containerRef}>{hasRenderFailed ? 'falhou' : 'desenhando'}</div>
  )
}

describe('useReadOnlyDiagramViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fakeViewer.importXML.mockResolvedValue(undefined)
  })

  it('draws the XML with the archQuest theme colors and fits it', async () => {
    render(<ViewerHarness bpmnXml="<definitions />" />)

    await waitFor(() =>
      expect(fakeViewer.zoom).toHaveBeenCalledWith('fit-viewport', 'auto'),
    )
    expect(fakeViewer.importXML).toHaveBeenCalledWith('<definitions />')
    expect(fakeViewer.options?.bpmnRenderer).toMatchObject({
      defaultFillColor: 'var(--bpmn-shape-fill)',
    })
  })

  it('reports a diagram that cannot be drawn', async () => {
    fakeViewer.importXML.mockRejectedValue(new Error('invalid'))

    render(<ViewerHarness bpmnXml="<broken" />)

    expect(await screen.findByText('falhou')).toBeInTheDocument()
  })

  it('destroys the viewer when unmounted', () => {
    const { unmount } = render(<ViewerHarness bpmnXml="<definitions />" />)

    unmount()

    expect(fakeViewer.destroy).toHaveBeenCalledOnce()
  })
})
