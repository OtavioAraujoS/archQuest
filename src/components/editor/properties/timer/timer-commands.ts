import type {
  BpmnFactoryService,
  ModelingService,
} from '@/types/diagram-js-services'

import { cycleToIso } from './timer-cycle-and-date'
import { durationToIso } from './timer-duration'
import {
  TIMER_KINDS,
  type FormalExpression,
  type TimerEventDefinition,
  type TimerExpression,
  type TimerKind,
} from './timer-event-definition'

export interface TimerCommandServices {
  modeling: ModelingService
  bpmnFactory: BpmnFactoryService
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000

function tomorrowAtNineAsIso(now: Date) {
  const tomorrow = new Date(now.getTime() + ONE_DAY_MS)
  const pad = (value: number) => String(value).padStart(2, '0')
  const date = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`
  return `${date}T09:00:00`
}

export function defaultIsoExpressionFor(kind: TimerKind, now = new Date()) {
  if (kind === 'timeDate') return tomorrowAtNineAsIso(now)
  if (kind === 'timeDuration')
    return durationToIso({ amount: 1, unit: 'hours' })
  return cycleToIso({
    repetitions: 3,
    interval: { amount: 10, unit: 'minutes' },
  })
}

export function setTimerExpression(
  services: TimerCommandServices,
  element: unknown,
  timerDefinition: TimerEventDefinition,
  { kind, isoExpression }: TimerExpression,
) {
  const expression = services.bpmnFactory.create<FormalExpression>(
    'bpmn:FormalExpression',
    { body: isoExpression },
  )
  expression.$parent = timerDefinition
  const timerProperties = Object.fromEntries(
    TIMER_KINDS.map((timerKind) => [
      timerKind,
      timerKind === kind ? expression : undefined,
    ]),
  )
  services.modeling.updateModdleProperties(
    element,
    timerDefinition,
    timerProperties,
  )
}
