import { defaultIsoExpressionFor, setTimerExpression, type TimerCommandServices } from './timer-commands'
import {
  readTimerExpression,
  type TimerEventDefinition,
  type TimerKind,
} from './timer-event-definition'
import { TimerExpressionInputs } from './TimerExpressionInputs'

const NOT_DEFINED = ''

const TIMER_KIND_LABELS: Record<TimerKind, string> = {
  timeDate: 'Data específica',
  timeDuration: 'Duração',
  timeCycle: 'Ciclo (repetição)',
}

interface TimerFieldProps {
  services: TimerCommandServices
  element: unknown
  timerDefinition: TimerEventDefinition
}

export function TimerField({
  services,
  element,
  timerDefinition,
}: Readonly<TimerFieldProps>) {
  const timerExpression = readTimerExpression(timerDefinition)

  function changeKind(kind: TimerKind) {
    setTimerExpression(services, element, timerDefinition, {
      kind,
      isoExpression: defaultIsoExpressionFor(kind),
    })
  }

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-xs font-medium">Timer</legend>
      <select
        aria-label="Tipo de timer"
        value={timerExpression?.kind ?? NOT_DEFINED}
        onChange={(event) => changeKind(event.target.value as TimerKind)}
        className="bg-background h-8 rounded-md border px-2 text-sm"
      >
        {!timerExpression && <option value={NOT_DEFINED}>Não definido</option>}
        {Object.entries(TIMER_KIND_LABELS).map(([kind, label]) => (
          <option key={kind} value={kind}>
            {label}
          </option>
        ))}
      </select>
      {timerExpression && (
        <TimerExpressionInputs
          timerExpression={timerExpression}
          onIsoExpressionChange={(isoExpression) =>
            setTimerExpression(services, element, timerDefinition, {
              kind: timerExpression.kind,
              isoExpression,
            })
          }
        />
      )}
    </fieldset>
  )
}
