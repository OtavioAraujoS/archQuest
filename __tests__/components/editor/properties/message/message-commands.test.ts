import { describe, expect, it, vi } from 'vitest'

import CreateAndAssignMessageHandler, {
  CREATE_AND_ASSIGN_MESSAGE,
} from '@/components/editor/properties/message/CreateAndAssignMessageHandler'
import { assignMessageToEvent, createMessageForEvent } from '@/components/editor/properties/message/message-commands'
import type {
  BpmnMessage,
  MessageEventDefinition,
} from '@/components/editor/properties/message/message-event-definition'

const eventShape = { id: 'Event_1' }
const existingMessage = { $type: 'bpmn:Message', id: 'Message_1' } as BpmnMessage

function createFakeMessageServices() {
  return {
    modeling: { updateModdleProperties: vi.fn() },
    commandStack: { execute: vi.fn(), registerHandler: vi.fn() },
    bpmnFactory: {
      create: vi.fn((type: string, attrs?: Record<string, unknown>) => ({
        $type: type,
        id: 'Message_new',
        ...attrs,
      })) as never,
    },
    definitions: { rootElements: [existingMessage] },
  }
}

function emptyMessageDefinition() {
  return { $type: 'bpmn:MessageEventDefinition' } as MessageEventDefinition
}

describe('assignMessageToEvent', () => {
  it('points the event definition to the chosen message', () => {
    const services = createFakeMessageServices()
    const eventDefinition = emptyMessageDefinition()

    assignMessageToEvent(services, eventShape, eventDefinition, existingMessage)

    expect(services.modeling.updateModdleProperties).toHaveBeenCalledWith(
      eventShape,
      eventDefinition,
      { messageRef: existingMessage },
    )
  })
})

describe('createMessageForEvent', () => {
  it('creates a named bpmn:Message and runs a single undoable command', () => {
    const services = createFakeMessageServices()
    const eventDefinition = emptyMessageDefinition()

    const message = createMessageForEvent(
      services,
      eventShape,
      eventDefinition,
      '  Pedido recebido ',
    )

    expect(message).toMatchObject({ $type: 'bpmn:Message', name: 'Pedido recebido' })
    expect(services.commandStack.execute).toHaveBeenCalledOnce()
    expect(services.commandStack.execute).toHaveBeenCalledWith(
      CREATE_AND_ASSIGN_MESSAGE,
      {
        element: eventShape,
        definitions: services.definitions,
        eventDefinition,
        message,
      },
    )
  })
})

describe('CreateAndAssignMessageHandler', () => {
  it('adds the message to the definitions and assigns it to the event', () => {
    const modeling = { updateModdleProperties: vi.fn() }
    const definitions = { rootElements: [existingMessage] }
    const eventDefinition = emptyMessageDefinition()
    const newMessage = { $type: 'bpmn:Message', id: 'Message_new' } as BpmnMessage

    new CreateAndAssignMessageHandler(modeling).preExecute({
      element: eventShape,
      definitions,
      eventDefinition,
      message: newMessage,
    })

    expect(modeling.updateModdleProperties).toHaveBeenNthCalledWith(
      1,
      eventShape,
      definitions,
      { rootElements: [existingMessage, newMessage] },
    )
    expect(modeling.updateModdleProperties).toHaveBeenNthCalledWith(
      2,
      eventShape,
      eventDefinition,
      { messageRef: newMessage },
    )
  })
})
