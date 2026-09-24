import {
  DURATION_UNIT_LABELS,
  type DurationUnit,
  type TimerDuration,
} from './timer-duration'

const MINIMUM_AMOUNT = 1

interface DurationInputsProps {
  label: string
  duration: TimerDuration
  onDurationChange: (duration: TimerDuration) => void
}

export function DurationInputs({
  label,
  duration,
  onDurationChange,
}: Readonly<DurationInputsProps>) {
  function changeAmount(rawAmount: string) {
    const amount = Math.floor(Number(rawAmount))
    if (amount >= MINIMUM_AMOUNT) onDurationChange({ ...duration, amount })
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs">{label}</span>
      <input
        type="number"
        min={MINIMUM_AMOUNT}
        aria-label={`${label} (quantidade)`}
        value={duration.amount}
        onChange={(event) => changeAmount(event.target.value)}
        className="bg-background h-8 w-16 rounded-md border px-2 text-sm"
      />
      <select
        aria-label={`${label} (unidade)`}
        value={duration.unit}
        onChange={(event) =>
          onDurationChange({
            ...duration,
            unit: event.target.value as DurationUnit,
          })
        }
        className="bg-background h-8 flex-1 rounded-md border px-2 text-sm"
      >
        {Object.entries(DURATION_UNIT_LABELS).map(([unit, unitLabel]) => (
          <option key={unit} value={unit}>
            {unitLabel}
          </option>
        ))}
      </select>
    </div>
  )
}
