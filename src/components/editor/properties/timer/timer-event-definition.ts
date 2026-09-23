import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil'

export type TimerKind = 'timeDate' | 'timeDuration' | 'timeCycle'

export const TIMER_KINDS: TimerKind[] = ['timeDate', 'timeDuration', 'timeCycle']

export interface FormalExpression {
  $type: 'bpmn:FormalExpression'
  $parent?: unknown
  body?: string
}

export type TimerEventDefinition = {
  $type: 'bpmn:TimerEventDefinition'
} & Partial<Record<TimerKind, FormalExpression>>

export interface TimerExpression {
  kind: TimerKind
  isoExpression: string
}

export function findTimerEventDefinition(
  element: unknown,
): TimerEventDefinition | undefined {
  const businessObject = getBusinessObject(element as never) as {
    eventDefinitions?: unknown[]
  }
  return businessObject?.eventDefinitions?.find((definition) =>
    is(definition as never, 'bpmn:TimerEventDefinition'),
  ) as TimerEventDefinition | undefined
}

export function readTimerExpression(
  timerDefinition: TimerEventDefinition,
): TimerExpression | undefined {
  const kind = TIMER_KINDS.find((timerKind) => timerDefinition[timerKind])
  if (!kind) return undefined
  return { kind, isoExpression: timerDefinition[kind]?.body ?? '' }
}
