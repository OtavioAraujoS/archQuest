import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { selectedElementsState, canvasFocus } = vi.hoisted(() => ({
  selectedElementsState: { current: [{ id: 'Task_1' }] as unknown[] },
  canvasFocus: vi.fn(),
}))

vi.mock('@/hooks/editor/useSelectedElements', () => ({
  useSelectedElements: () => ({
    selectedElements: selectedElementsState.current,
  }),
}))
vi.mock('@/components/editor/ElementStylePanel', () => ({
  ElementStylePanel: () => <section aria-label="Aparência" />,
}))
vi.mock('@/components/editor/element-menu/ElementSizeFields', () => ({
  ElementSizeFields: () => <section aria-label="Tamanho" />,
}))
vi.mock('@/components/editor/properties/PropertiesPanel', () => ({
  PropertiesPanel: () => null,
}))

import { ElementContextMenu } from '@/components/editor/element-menu/ElementContextMenu'

const ANCHOR = { left: 100, top: 300, width: 100, height: 80 }
const modelerRef = {
  current: { get: () => ({ focus: canvasFocus }) } as unknown as BpmnModeler,
}

function renderMenu(anchor: typeof ANCHOR | null = ANCHOR) {
  const onClose = vi.fn()
  render(
    <ElementContextMenu
      modelerRef={modelerRef}
      status="ready"
      anchor={anchor}
      onClose={onClose}
    />,
  )
  return onClose
}

describe('ElementContextMenu', () => {
  beforeEach(() => {
    canvasFocus.mockClear()
    selectedElementsState.current = [{ id: 'Task_1' }]
  })

  it('shows appearance and size for the selection', () => {
    renderMenu()

    const menu = screen.getByRole('dialog', { name: 'Editar elemento' })
    expect(menu).toHaveTextContent('1 elemento selecionado')
    expect(
      screen.getByRole('region', { name: 'Aparência' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Tamanho' })).toBeInTheDocument()
    expect(menu).toHaveFocus()
  })

  it('counts several selected elements', () => {
    selectedElementsState.current = [{}, {}, {}]

    renderMenu()

    expect(screen.getByRole('dialog')).toHaveTextContent(
      '3 elementos selecionados',
    )
  })

  it('closes with Escape and returns focus to the canvas', () => {
    const onClose = renderMenu()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalled()
    expect(canvasFocus).toHaveBeenCalled()
  })

  it('closes from its close button', () => {
    const onClose = renderMenu()

    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(onClose).toHaveBeenCalled()
  })

  it('stays hidden without an anchor', () => {
    renderMenu(null)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
