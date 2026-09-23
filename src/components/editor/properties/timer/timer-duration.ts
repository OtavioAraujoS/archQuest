export type DurationUnit = 'minutes' | 'hours' | 'days' | 'weeks'

export interface TimerDuration {
  amount: number
  unit: DurationUnit
}

export const DURATION_UNIT_LABELS: Record<DurationUnit, string> = {
  minutes: 'minutos',
  hours: 'horas',
  days: 'dias',
  weeks: 'semanas',
}

const ISO_DURATION_BY_UNIT: Record<DurationUnit, (amount: number) => string> = {
  minutes: (amount) => `PT${amount}M`,
  hours: (amount) => `PT${amount}H`,
  days: (amount) => `P${amount}D`,
  weeks: (amount) => `P${amount}W`,
}

const SINGLE_UNIT_ISO_DURATION = /^P(?:(\d+)([DW])|T(\d+)([HM]))$/

const UNIT_BY_ISO_DESIGNATOR: Record<string, DurationUnit> = {
  D: 'days',
  W: 'weeks',
  H: 'hours',
  M: 'minutes',
}

export function durationToIso({ amount, unit }: TimerDuration) {
  return ISO_DURATION_BY_UNIT[unit](amount)
}

export function parseIsoDuration(isoDuration: string): TimerDuration | undefined {
  const match = SINGLE_UNIT_ISO_DURATION.exec(isoDuration.trim())
  if (!match) return undefined

  const [, dateAmount, dateDesignator, timeAmount, timeDesignator] = match
  return {
    amount: Number(dateAmount ?? timeAmount),
    unit: UNIT_BY_ISO_DESIGNATOR[dateDesignator ?? timeDesignator],
  }
}
