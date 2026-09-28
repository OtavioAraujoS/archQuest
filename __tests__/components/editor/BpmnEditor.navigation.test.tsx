import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { makeDiagramRecord } from './test-support/bpmn-editor-fakes'

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }))

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'diagram-1' }),
}))

vi.mock('@/hooks/editor/useBpmnEditor', () => ({
  useBpmnEditor: () => ({
    containerRef: { current: null },
    modelerRef: { current: null },
    name: 'Processo original',
    status: 'ready',
    autosaveState: 'idle',
    persistName: vi.fn(),
    reloadDiagram: vi.fn(),
    handleExportBpmn: vi.fn(),
    handleExportSvg: vi.fn(),
    handleExportPng: vi.fn(),
    handleImport: vi.fn(),
  }),
}))

import { BpmnEditor } from '@/components/editor/BpmnEditor'

describe('BpmnEditor navigation', () => {
  beforeEach(async () => {
    mockNavigate.mockClear()
    await db.diagrams.clear()
  })

  it('goes back to the folder the diagram is in', async () => {
    await db.diagrams.add(makeDiagramRecord({ folderId: 'folder-1' }))
    render(<BpmnEditor />)

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Voltar' }))
      expect(mockNavigate).toHaveBeenLastCalledWith(
        '/diagramas/pastas/folder-1',
      )
    })
  })

  it('goes back to the library for a diagram outside folders', async () => {
    await db.diagrams.add(makeDiagramRecord())
    render(<BpmnEditor />)

    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(mockNavigate).toHaveBeenCalledWith('/diagramas')
  })
})
