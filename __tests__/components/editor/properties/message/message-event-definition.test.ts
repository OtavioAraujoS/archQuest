import { BpmnModdle } from 'bpmn-moddle'
import { describe, expect, it } from 'vitest'

import {
  findMessageEventDefinition,
  listDefinedMessages,
  messageDisplayName,
  type BpmnDefinitions,
  type BpmnMessage,
} from '@/components/editor/properties/message/message-event-definition'

const moddle = new BpmnModdle()

function shapeWithBusinessObject(businessObject: unknown) {
  return { businessObject }
}

describe('findMessageEventDefinition', () => {
  it('returns the message event definition of a message event', () => {
    const messageDefinition = moddle.create('bpmn:MessageEventDefinition')
    const startEvent = moddle.create('bpmn:StartEvent', {
      eventDefinitions: [messageDefinition],
    })

    expect(
      findMessageEventDefinition(shapeWithBusinessObject(startEvent)),
    ).toBe(messageDefinition)
  })

  it('ignores events without a message definition', () => {
    const timerStart = moddle.create('bpmn:StartEvent', {
      eventDefinitions: [moddle.create('bpmn:TimerEventDefinition')],
    })
    const task = moddle.create('bpmn:Task')

    expect(
      findMessageEventDefinition(shapeWithBusinessObject(timerStart)),
    ).toBe(undefined)
    expect(findMessageEventDefinition(shapeWithBusinessObject(task))).toBe(
      undefined,
    )
  })
})

describe('listDefinedMessages', () => {
  it('lists only the bpmn:Message root elements', () => {
    const order = moddle.create('bpmn:Message', { id: 'Message_order' })
    const definitions = moddle.create('bpmn:Definitions', {
      rootElements: [moddle.create('bpmn:Process'), order],
    }) as unknown as BpmnDefinitions

    expect(listDefinedMessages(definitions)).toEqual([order])
  })

  it('returns an empty list when there are no root elements', () => {
    expect(listDefinedMessages({})).toEqual([])
  })
})

describe('messageDisplayName', () => {
  it('prefers the message name and falls back to the id', () => {
    const named = { id: 'Message_1', name: 'Pedido recebido' } as BpmnMessage
    const unnamed = { id: 'Message_2', name: '  ' } as BpmnMessage

    expect(messageDisplayName(named)).toBe('Pedido recebido')
    expect(messageDisplayName(unnamed)).toBe('Message_2')
  })
})
