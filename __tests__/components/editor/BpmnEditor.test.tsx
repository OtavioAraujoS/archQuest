import { fireEvent, render, screen } from '@testing-library/react'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { INITIAL_SYNC_STATE, useSyncStore } from '@/lib/sync/sync-store'

const {
  mockNavigate,
  mockPersistName,
  mockExportBpmn,
  mockExportSvg,
  mockExportPng,
  mockUseBpmnEditor,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockPersistName: vi.fn(),
  mockExportBpmn: vi.fn(),
  mockExportSvg: vi.fn(),
  mockExportPng: vi.fn(),
  mockUseBpmnEditor: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'diagram-1' }),
}))

vi.mock('@/hooks/editor/useBpmnEditor', () => ({
  useBpmnEditor: mockUseBpmnEditor,
}))

import { BpmnEditor } from '@/components/editor/BpmnEditor'

function setHookReturn(overrides: Record<string, unknown> = {}) {
  mockUseBpmnEditor.mockReturnValue({
    containerRef: { current: null },
    modelerRef: { current: null },
    name: 'Processo de vendas',
    status: 'ready',
    autosaveState: 'idle',
    persistName: mockPersistName,
    handleExportBpmn: mockExportBpmn,
    handleExportSvg: mockExportSvg,
    handleExportPng: mockExportPng,
    handleImport: vi.fn(),
    reloadDiagram: vi.fn(),
    ...overrides,
  })
}

describe('BpmnEditor', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockPersistName.mockClear()
    mockExportBpmn.mockClear()
    mockExportSvg.mockClear()
    mockExportPng.mockClear()
    setHookReturn()
  })

  afterEach(() => {
    act(() => useSyncStore.setState(INITIAL_SYNC_STATE))
  })

  it('renders the diagram name and navigates back on click', () => {
    render(<BpmnEditor />)

    expect(screen.getByPlaceholderText('Nome do diagrama')).toHaveValue(
      'Processo de vendas',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(mockNavigate).toHaveBeenCalledWith('/diagramas')
  })

  it('calls persistName when the diagram name changes', () => {
    render(<BpmnEditor />)

    fireEvent.change(screen.getByPlaceholderText('Nome do diagrama'), {
      target: { value: 'Novo nome' },
    })

    expect(mockPersistName).toHaveBeenCalledWith('Novo nome')
  })

  it('wires the file menu exports to the hook handlers', () => {
    render(<BpmnEditor />)

    for (const exportLabel of ['Arquivo .bpmn', 'Imagem SVG', 'Imagem PNG']) {
      fireEvent.click(screen.getByRole('button', { name: /Arquivo/ }))
      fireEvent.click(screen.getByRole('menuitem', { name: exportLabel }))
    }

    expect(mockExportBpmn).toHaveBeenCalledTimes(1)
    expect(mockExportSvg).toHaveBeenCalledTimes(1)
    expect(mockExportPng).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('shows an error message when the diagram fails to load', () => {
    setHookReturn({ status: 'error' })

    render(<BpmnEditor />)

    expect(
      screen.getByText(
        'Não foi possível carregar este diagrama. Ele pode ter sido removido.',
      ),
    ).toBeInTheDocument()
  })

  it('asks how to resolve a conflict only for the open diagram', () => {
    act(() =>
      useSyncStore.setState({ conflictedDiagramIds: ['another-diagram'] }),
    )
    render(<BpmnEditor />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    act(() => useSyncStore.setState({ conflictedDiagramIds: ['diagram-1'] }))

    expect(
      screen.getByRole('dialog', {
        name: 'Este diagrama mudou em outro lugar',
      }),
    ).toBeInTheDocument()
  })
})
