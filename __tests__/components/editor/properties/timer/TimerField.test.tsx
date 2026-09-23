import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setTimerExpression } from '@/components/editor/properties/timer/timer-commands'
import type { TimerEventDefinition } from '@/components/editor/properties/timer/timer-event-definition'
import { TimerField } from '@/components/editor/properties/timer/TimerField'

vi.mock('@/components/editor/properties/timer/timer-commands', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/components/editor/properties/timer/timer-commands')>()),
  setTimerExpression: vi.fn(),
}))

const timerEventShape = { id: 'Event_timer' }
const services = {} as never

function renderTimerField(timerDefinition: TimerEventDefinition) {
  render(
    <TimerField
      services={services}
      element={timerEventShape}
      timerDefinition={timerDefinition}
    />,
  )
}

describe('TimerField', () => {
  beforeEach(() => vi.clearAllMocks())

  it('asks for the timer kind when the timer was not configured yet', () => {
    renderTimerField({ $type: 'bpmn:TimerEventDefinition' })

    expect(screen.getByLabelText('Tipo de timer')).toHaveValue('')
    expect(screen.getByRole('option', { name: 'Não definido' })).toBeInTheDocument()
  })

  it('starts a newly chosen kind with a sensible default', () => {
    const timerDefinition = { $type: 'bpmn:TimerEventDefinition' } as const

    renderTimerField(timerDefinition)
    fireEvent.change(screen.getByLabelText('Tipo de timer'), {
      target: { value: 'timeCycle' },
    })

    expect(setTimerExpression).toHaveBeenCalledWith(
      services,
      timerEventShape,
      timerDefinition,
      { kind: 'timeCycle', isoExpression: 'R3/PT10M' },
    )
  })

  it('saves edits of the configured expression', () => {
    const timerDefinition = {
      $type: 'bpmn:TimerEventDefinition',
      timeDuration: { $type: 'bpmn:FormalExpression', body: 'PT2H' },
    } as const

    renderTimerField(timerDefinition)
    fireEvent.change(screen.getByLabelText('Esperar (quantidade)'), {
      target: { value: '4' },
    })

    expect(screen.getByLabelText('Tipo de timer')).toHaveValue('timeDuration')
    expect(setTimerExpression).toHaveBeenCalledWith(
      services,
      timerEventShape,
      timerDefinition,
      { kind: 'timeDuration', isoExpression: 'PT4H' },
    )
  })
})
