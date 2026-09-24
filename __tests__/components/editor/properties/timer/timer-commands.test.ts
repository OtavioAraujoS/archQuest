import { describe, expect, it, vi } from 'vitest'

import { defaultIsoExpressionFor, setTimerExpression } from '@/components/editor/properties/timer/timer-commands'
import type { TimerEventDefinition } from '@/components/editor/properties/timer/timer-event-definition'

const timerEventShape = { id: 'Event_timer' }

function createFakeTimerServices() {
  return {
    modeling: { updateModdleProperties: vi.fn() },
    bpmnFactory: {
      create: vi.fn((type: string, attrs?: Record<string, unknown>) => ({
        $type: type,
        ...attrs,
      })) as never,
    },
  }
}

describe('setTimerExpression', () => {
  it('stores the ISO expression and clears the other timer kinds in one command', () => {
    const services = createFakeTimerServices()
    const timerDefinition = {
      $type: 'bpmn:TimerEventDefinition',
    } as TimerEventDefinition

    setTimerExpression(services, timerEventShape, timerDefinition, {
      kind: 'timeDuration',
      isoExpression: 'PT2H',
    })

    expect(services.modeling.updateModdleProperties).toHaveBeenCalledOnce()
    expect(services.modeling.updateModdleProperties).toHaveBeenCalledWith(
      timerEventShape,
      timerDefinition,
      {
        timeDate: undefined,
        timeDuration: {
          $type: 'bpmn:FormalExpression',
          body: 'PT2H',
          $parent: timerDefinition,
        },
        timeCycle: undefined,
      },
    )
  })
})

describe('defaultIsoExpressionFor', () => {
  it('suggests tomorrow at 9:00 for a specific date', () => {
    const now = new Date(2026, 8, 30, 15, 45)

    expect(defaultIsoExpressionFor('timeDate', now)).toBe('2026-10-01T09:00:00')
  })

  it('suggests one hour for a duration and three runs every ten minutes for a cycle', () => {
    expect(defaultIsoExpressionFor('timeDuration')).toBe('PT1H')
    expect(defaultIsoExpressionFor('timeCycle')).toBe('R3/PT10M')
  })
})
