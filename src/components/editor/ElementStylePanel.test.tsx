import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ElementStylePanel } from './ElementStylePanel'

function createFakeModeler(selected: unknown[]) {
  const handlers: Record<string, () => void> = {}
  const eventBus = {
    on: (event: string, cb: () => void) => {
      handlers[event] = cb
    },
    off: vi.fn(),
    fire: vi.fn(),
  }
  const modeling = { setColor: vi.fn(), updateModdleProperties: vi.fn() }
  const bpmnFactory = {
    create: (type: string, attrs: Record<string, unknown> = {}) => {
      const entry: Record<string, unknown> = {
        $type: type,
        values: [],
        ...attrs,
      }
      entry.get = (name: string) => entry[name]
      return entry
    },
  }
  const services: Record<string, unknown> = {
    eventBus,
    selection: { get: () => selected },
    modeling,
    bpmnFactory,
  }

  return {
    modeler: {
      get: (name: string) => services[name],
    } as unknown as BpmnModeler,
    eventBus,
    modeling,
  }
}

describe('ElementStylePanel', () => {
  it('renders nothing when nothing is selected', () => {
    const { modeler } = createFakeModeler([])

    const { container } = render(
      <ElementStylePanel modelerRef={{ current: modeler }} status="ready" />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('shows fill/border/text controls for a selected shape and wires them up', () => {
    const shape = { id: 'Task_1', businessObject: {} }
    const { modeler, modeling } = createFakeModeler([shape])

    render(
      <ElementStylePanel modelerRef={{ current: modeler }} status="ready" />,
    )

    fireEvent.change(
      screen.getByTitle('Cor de preenchimento').querySelector('input')!,
      {
        target: { value: '#112233' },
      },
    )
    expect(modeling.setColor).toHaveBeenCalledWith([shape], { fill: '#112233' })

    fireEvent.change(
      screen.getByTitle('Cor da borda').querySelector('input')!,
      {
        target: { value: '#445566' },
      },
    )
    expect(modeling.setColor).toHaveBeenCalledWith([shape], {
      stroke: '#445566',
    })

    fireEvent.click(screen.getByRole('button', { name: 'Negrito' }))
    expect(modeling.updateModdleProperties).toHaveBeenCalledTimes(1)
  })

  it('hides the fill picker when only a connection is selected', () => {
    const connection = { id: 'Flow_1', businessObject: {}, waypoints: [] }
    const { modeler } = createFakeModeler([connection])

    render(
      <ElementStylePanel modelerRef={{ current: modeler }} status="ready" />,
    )

    expect(screen.queryByTitle('Cor de preenchimento')).not.toBeInTheDocument()
    expect(screen.getByTitle('Cor da borda')).toBeInTheDocument()
  })
})
