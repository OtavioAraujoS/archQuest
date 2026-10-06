import { findEventDefinition } from '@/lib/bpmn/find-event-definition'
import type {
  TimerEventDefinition,
  TimerExpression,
  TimerKind,
} from '@/types/properties'

export const TIMER_KINDS: TimerKind[] = [
  'timeDate',
  'timeDuration',
  'timeCycle',
]

export function findTimerEventDefinition(element: unknown) {
  return findEventDefinition<TimerEventDefinition>(
    element,
    'bpmn:TimerEventDefinition',
  )
}

export function readTimerExpression(
  timerDefinition: TimerEventDefinition,
): TimerExpression | undefined {
  const kind = TIMER_KINDS.find((timerKind) => timerDefinition[timerKind])
  if (!kind) return undefined
  return { kind, isoExpression: timerDefinition[kind]?.body ?? '' }
}
