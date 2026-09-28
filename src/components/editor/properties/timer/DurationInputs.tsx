import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'

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
      <Input
        type="number"
        min={MINIMUM_AMOUNT}
        size="sm"
        aria-label={`${label} (quantidade)`}
        value={duration.amount}
        onChange={(event) => changeAmount(event.target.value)}
        className="w-16"
      />
      <NativeSelect
        size="sm"
        aria-label={`${label} (unidade)`}
        value={duration.unit}
        onChange={(event) =>
          onDurationChange({
            ...duration,
            unit: event.target.value as DurationUnit,
          })
        }
        className="flex-1"
      >
        {Object.entries(DURATION_UNIT_LABELS).map(([unit, unitLabel]) => (
          <option key={unit} value={unit}>
            {unitLabel}
          </option>
        ))}
      </NativeSelect>
    </div>
  )
}
