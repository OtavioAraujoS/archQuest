import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

vi.mock('@/components/editor/useBpmnEditor', () => ({
  useBpmnEditor: mockUseBpmnEditor,
}))

import { BpmnEditor } from '@/components/editor/BpmnEditor'

function setHookReturn(overrides: Record<string, unknown> = {}) {
  mockUseBpmnEditor.mockReturnValue({
    containerRef: { current: null },
    modelerRef: { current: null },
    name: 'Processo de vendas',
    status: 'ready',
    persistName: mockPersistName,
    handleExportBpmn: mockExportBpmn,
    handleExportSvg: mockExportSvg,
    handleExportPng: mockExportPng,
    handleImport: vi.fn(),
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

  it('renders the diagram name and navigates back on click', () => {
    render(<BpmnEditor />)

    expect(screen.getByPlaceholderText('Nome do diagrama')).toHaveValue(
      'Processo de vendas',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('calls persistName when the diagram name changes', () => {
    render(<BpmnEditor />)

    fireEvent.change(screen.getByPlaceholderText('Nome do diagrama'), {
      target: { value: 'Novo nome' },
    })

    expect(mockPersistName).toHaveBeenCalledWith('Novo nome')
  })

  it('wires the export buttons to the hook handlers', () => {
    render(<BpmnEditor />)

    fireEvent.click(screen.getByRole('button', { name: '.bpmn' }))
    fireEvent.click(screen.getByRole('button', { name: 'SVG' }))
    fireEvent.click(screen.getByRole('button', { name: 'PNG' }))

    expect(mockExportBpmn).toHaveBeenCalledTimes(1)
    expect(mockExportSvg).toHaveBeenCalledTimes(1)
    expect(mockExportPng).toHaveBeenCalledTimes(1)
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
})
