import { Input } from '@/components/ui/input'

import { DurationInputs } from './DurationInputs'
import type { TimerCycle } from './timer-cycle-and-date'

interface CycleInputsProps {
  cycle: TimerCycle
  onCycleChange: (cycle: TimerCycle) => void
}

export function CycleInputs({
  cycle,
  onCycleChange,
}: Readonly<CycleInputsProps>) {
  function changeRepetitions(rawRepetitions: string) {
    const repetitions = Math.floor(Number(rawRepetitions))
    onCycleChange({
      ...cycle,
      repetitions: repetitions > 0 ? repetitions : undefined,
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <DurationInputs
        label="A cada"
        duration={cycle.interval}
        onDurationChange={(interval) => onCycleChange({ ...cycle, interval })}
      />
      <label className="flex items-center gap-1 text-xs">
        <span>Repetir</span>
        <Input
          type="number"
          min={1}
          size="sm"
          aria-label="Repetições"
          placeholder="sem limite"
          value={cycle.repetitions ?? ''}
          onChange={(event) => changeRepetitions(event.target.value)}
          className="w-24"
        />
        <span>vezes</span>
      </label>
    </div>
  )
}
