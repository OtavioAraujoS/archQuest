import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PropertiesPanel } from '@/components/editor/properties/PropertiesPanel'

vi.mock('@/components/editor/properties/message/MessageField', () => ({
  MessageField: () => <div>campo de mensagem</div>,
}))
vi.mock('@/components/editor/properties/timer/TimerField', () => ({
  TimerField: () => <div>campo de timer</div>,
}))

const timerCatchEvent = {
  businessObject: {
    $type: 'bpmn:IntermediateCatchEvent',
    $instanceOf: (type: string) => type === 'bpmn:IntermediateCatchEvent',
    eventDefinitions: [
      {
        $type: 'bpmn:TimerEventDefinition',
        $instanceOf: (type: string) => type === 'bpmn:TimerEventDefinition',
      },
    ],
  },
}

const messageStartEvent = {
  businessObject: {
    $type: 'bpmn:StartEvent',
    $instanceOf: (type: string) => type === 'bpmn:StartEvent',
    eventDefinitions: [
      {
        $type: 'bpmn:MessageEventDefinition',
        $instanceOf: (type: string) => type === 'bpmn:MessageEventDefinition',
      },
    ],
  },
}
const plainTask = {
  businessObject: {
    $type: 'bpmn:Task',
    $instanceOf: (type: string) => type === 'bpmn:Task',
  },
}

function createFakeModeler(initiallySelected: unknown[]) {
  const listeners = new Map<string, () => void>()
  let selectedElements = initiallySelected
  const services: Record<string, unknown> = {
    eventBus: {
      on: (event: string, callback: () => void) => listeners.set(event, callback),
      off: (event: string) => listeners.delete(event),
    },
    selection: { get: () => selectedElements },
  }
  const modeler = {
    get: (name: string) => services[name] ?? {},
    getDefinitions: () => ({ rootElements: [] }),
  }
  function select(elements: unknown[]) {
    selectedElements = elements
    act(() => listeners.get('selection.changed')?.())
  }
  return { modelerRef: { current: modeler as never }, select }
}

describe('PropertiesPanel', () => {
  it('shows the message field when a message event is selected', () => {
    const { modelerRef } = createFakeModeler([messageStartEvent])

    render(<PropertiesPanel modelerRef={modelerRef} status="ready" />)

    expect(screen.getByLabelText('Propriedades')).toBeInTheDocument()
    expect(screen.getByText('campo de mensagem')).toBeInTheDocument()
    expect(screen.queryByText('campo de timer')).not.toBeInTheDocument()
  })

  it('shows the timer field when a timer event is selected', () => {
    const { modelerRef } = createFakeModeler([timerCatchEvent])

    render(<PropertiesPanel modelerRef={modelerRef} status="ready" />)

    expect(screen.getByText('campo de timer')).toBeInTheDocument()
    expect(screen.queryByText('campo de mensagem')).not.toBeInTheDocument()
  })

  it('stays hidden for elements without editable properties', () => {
    const { modelerRef } = createFakeModeler([plainTask])

    render(<PropertiesPanel modelerRef={modelerRef} status="ready" />)

    expect(screen.queryByLabelText('Propriedades')).not.toBeInTheDocument()
  })

  it('follows the selection and hides for multiple selected elements', () => {
    const { modelerRef, select } = createFakeModeler([])
    render(<PropertiesPanel modelerRef={modelerRef} status="ready" />)

    select([messageStartEvent])
    expect(screen.getByLabelText('Propriedades')).toBeInTheDocument()

    select([messageStartEvent, plainTask])
    expect(screen.queryByLabelText('Propriedades')).not.toBeInTheDocument()
  })

  it('renders nothing while the diagram is loading', () => {
    const { modelerRef } = createFakeModeler([messageStartEvent])

    render(<PropertiesPanel modelerRef={modelerRef} status="loading" />)

    expect(screen.queryByLabelText('Propriedades')).not.toBeInTheDocument()
  })
})
