import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { TimerExpression } from './timer-event-definition'
import { TimerExpressionInputs } from './TimerExpressionInputs'

function renderInputs(timerExpression: TimerExpression) {
  const onIsoExpressionChange = vi.fn()
  render(
    <TimerExpressionInputs
      timerExpression={timerExpression}
      onIsoExpressionChange={onIsoExpressionChange}
    />,
  )
  return onIsoExpressionChange
}

describe('TimerExpressionInputs', () => {
  it('edits a specific date with a date-time picker', () => {
    const onIsoExpressionChange = renderInputs({
      kind: 'timeDate',
      isoExpression: '2026-10-01T09:00:00',
    })

    fireEvent.change(screen.getByLabelText('Data e hora'), {
      target: { value: '2026-10-02T14:30' },
    })

    expect(onIsoExpressionChange).toHaveBeenCalledWith('2026-10-02T14:30:00')
  })

  it('edits a duration by amount and unit', () => {
    const onIsoExpressionChange = renderInputs({
      kind: 'timeDuration',
      isoExpression: 'PT2H',
    })

    fireEvent.change(screen.getByLabelText('Esperar (quantidade)'), {
      target: { value: '5' },
    })
    fireEvent.change(screen.getByLabelText('Esperar (unidade)'), {
      target: { value: 'days' },
    })

    expect(onIsoExpressionChange).toHaveBeenNthCalledWith(1, 'PT5H')
    expect(onIsoExpressionChange).toHaveBeenNthCalledWith(2, 'P2D')
  })

  it('ignores amounts below one', () => {
    const onIsoExpressionChange = renderInputs({
      kind: 'timeDuration',
      isoExpression: 'PT2H',
    })

    fireEvent.change(screen.getByLabelText('Esperar (quantidade)'), {
      target: { value: '0' },
    })

    expect(onIsoExpressionChange).not.toHaveBeenCalled()
  })

  it('edits the interval and repetitions of a cycle', () => {
    const onIsoExpressionChange = renderInputs({
      kind: 'timeCycle',
      isoExpression: 'R3/PT10M',
    })

    fireEvent.change(screen.getByLabelText('A cada (quantidade)'), {
      target: { value: '30' },
    })
    fireEvent.change(screen.getByLabelText('Repetições'), {
      target: { value: '' },
    })

    expect(onIsoExpressionChange).toHaveBeenNthCalledWith(1, 'R3/PT30M')
    expect(onIsoExpressionChange).toHaveBeenNthCalledWith(2, 'R/PT10M')
  })

  it('keeps unsupported ISO expressions editable as raw text', () => {
    const onIsoExpressionChange = renderInputs({
      kind: 'timeDuration',
      isoExpression: 'PT1H30M',
    })
    const rawInput = screen.getByLabelText('Expressão ISO 8601')
    expect(rawInput).toHaveValue('PT1H30M')

    fireEvent.blur(rawInput, { target: { value: ' PT2H15M ' } })

    expect(onIsoExpressionChange).toHaveBeenCalledWith('PT2H15M')
  })

  it('does not rewrite an unchanged raw expression on blur', () => {
    const onIsoExpressionChange = renderInputs({
      kind: 'timeDate',
      isoExpression: '2026-10-01T09:00:00Z',
    })

    fireEvent.blur(screen.getByLabelText('Expressão ISO 8601'))

    expect(onIsoExpressionChange).not.toHaveBeenCalled()
  })
})
