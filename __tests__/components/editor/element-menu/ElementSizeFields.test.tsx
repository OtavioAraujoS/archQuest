import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  makeResizableShape,
  smallestResizeBox,
} from '../multi-resize/group-resize-fakes'

const { selectedElementsState, commandStack } = vi.hoisted(() => ({
  selectedElementsState: { current: [] as unknown[] },
  commandStack: { execute: vi.fn() },
}))

const modeler = {
  get: (name: string) =>
    ({
      rules: { allowed: () => true },
      resize: smallestResizeBox,
      commandStack,
    })[name],
} as unknown as BpmnModeler

vi.mock('@/hooks/editor/useSelectedElements', () => ({
  useSelectedElements: () => ({
    modeler,
    selectedElements: selectedElementsState.current,
  }),
}))

import { ElementSizeFields } from '@/components/editor/element-menu/ElementSizeFields'
import { RESIZE_ELEMENTS } from '@/components/editor/element-resize/ResizeElementsHandler'

function renderSizeFields() {
  render(<ElementSizeFields modelerRef={{ current: modeler }} status="ready" />)
}

describe('ElementSizeFields', () => {
  beforeEach(() => {
    commandStack.execute.mockClear()
    selectedElementsState.current = [
      makeResizableShape('bpmn:Task', { x: 0, y: 0, width: 100, height: 80 }),
    ]
  })

  it('shows the current width and height', () => {
    renderSizeFields()

    expect(screen.getByRole('spinbutton', { name: /Largura/ })).toHaveValue(100)
    expect(screen.getByRole('spinbutton', { name: /Altura/ })).toHaveValue(80)
  })

  it('resizes the selection when a new width is confirmed', () => {
    renderSizeFields()
    const widthField = screen.getByRole('spinbutton', { name: /Largura/ })

    fireEvent.change(widthField, { target: { value: '150' } })
    fireEvent.keyDown(widthField, { key: 'Enter' })

    expect(commandStack.execute).toHaveBeenCalledWith(RESIZE_ELEMENTS, {
      resizes: [
        {
          shape: selectedElementsState.current[0],
          bounds: { x: 0, y: 0, width: 150, height: 80 },
        },
      ],
    })
  })

  it('tells when the size was raised to the minimum', () => {
    renderSizeFields()
    const heightField = screen.getByRole('spinbutton', { name: /Altura/ })

    fireEvent.change(heightField, { target: { value: '5' } })
    fireEvent.blur(heightField)

    expect(
      screen.getByText('Ajustado ao tamanho mínimo que o elemento permite.'),
    ).toBeInTheDocument()
  })

  it('stays hidden for shapes with a fixed size', () => {
    selectedElementsState.current = [
      {
        ...makeResizableShape('bpmn:SequenceFlow', {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        }),
        waypoints: [],
      },
    ]

    renderSizeFields()

    expect(
      screen.queryByRole('region', { name: 'Tamanho' }),
    ).not.toBeInTheDocument()
  })
})
