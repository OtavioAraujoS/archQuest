import { BpmnModdle } from 'bpmn-moddle'
import { describe, expect, it } from 'vitest'

import {
  findTimerEventDefinition,
  readTimerExpression,
  type TimerEventDefinition,
} from '@/components/editor/properties/timer/timer-event-definition'

const moddle = new BpmnModdle()

function timerDefinitionWith(properties: Record<string, unknown>) {
  return moddle.create(
    'bpmn:TimerEventDefinition',
    properties,
  ) as unknown as TimerEventDefinition
}

describe('findTimerEventDefinition', () => {
  it('returns the timer definition of a timer event', () => {
    const timerDefinition = moddle.create('bpmn:TimerEventDefinition')
    const catchEvent = moddle.create('bpmn:IntermediateCatchEvent', {
      eventDefinitions: [timerDefinition],
    })

    expect(findTimerEventDefinition({ businessObject: catchEvent })).toBe(
      timerDefinition,
    )
  })

  it('ignores events without a timer definition', () => {
    const messageStart = moddle.create('bpmn:StartEvent', {
      eventDefinitions: [moddle.create('bpmn:MessageEventDefinition')],
    })

    expect(
      findTimerEventDefinition({ businessObject: messageStart }),
    ).toBeUndefined()
  })
})

describe('readTimerExpression', () => {
  it('returns undefined for a timer that was not configured yet', () => {
    expect(readTimerExpression(timerDefinitionWith({}))).toBeUndefined()
  })

  it('reads the kind and ISO body of the configured expression', () => {
    const timeCycle = moddle.create('bpmn:FormalExpression', {
      body: 'R3/PT10M',
    })

    expect(readTimerExpression(timerDefinitionWith({ timeCycle }))).toEqual({
      kind: 'timeCycle',
      isoExpression: 'R3/PT10M',
    })
  })

  it('treats an expression without body as empty', () => {
    const timeDuration = moddle.create('bpmn:FormalExpression')

    expect(readTimerExpression(timerDefinitionWith({ timeDuration }))).toEqual({
      kind: 'timeDuration',
      isoExpression: '',
    })
  })
})
