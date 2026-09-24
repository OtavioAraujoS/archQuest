import { CycleInputs } from './CycleInputs'
import { DurationInputs } from './DurationInputs'
import {
  cycleToIso,
  localDateTimeToIso,
  parseIsoCycle,
  parseIsoLocalDateTime,
} from './timer-cycle-and-date'
import { durationToIso, parseIsoDuration } from './timer-duration'
import type { TimerExpression } from './timer-event-definition'

const INPUT_CLASS = 'bg-background h-8 rounded-md border px-2 text-sm'

interface TimerExpressionInputsProps {
  timerExpression: TimerExpression
  onIsoExpressionChange: (isoExpression: string) => void
}

export function TimerExpressionInputs({
  timerExpression: { kind, isoExpression },
  onIsoExpressionChange,
}: Readonly<TimerExpressionInputsProps>) {
  const localDateTime =
    kind === 'timeDate' && parseIsoLocalDateTime(isoExpression)
  if (localDateTime) {
    return (
      <input
        type="datetime-local"
        aria-label="Data e hora"
        value={localDateTime}
        onChange={(event) =>
          event.target.value &&
          onIsoExpressionChange(localDateTimeToIso(event.target.value))
        }
        className={INPUT_CLASS}
      />
    )
  }

  const duration = kind === 'timeDuration' && parseIsoDuration(isoExpression)
  if (duration) {
    return (
      <DurationInputs
        label="Esperar"
        duration={duration}
        onDurationChange={(next) => onIsoExpressionChange(durationToIso(next))}
      />
    )
  }

  const cycle = kind === 'timeCycle' && parseIsoCycle(isoExpression)
  if (cycle) {
    return (
      <CycleInputs
        cycle={cycle}
        onCycleChange={(next) => onIsoExpressionChange(cycleToIso(next))}
      />
    )
  }

  return (
    <input
      key={isoExpression}
      aria-label="Expressão ISO 8601"
      defaultValue={isoExpression}
      onBlur={(event) =>
        event.target.value !== isoExpression &&
        onIsoExpressionChange(event.target.value.trim())
      }
      className={`${INPUT_CLASS} font-mono`}
    />
  )
}
