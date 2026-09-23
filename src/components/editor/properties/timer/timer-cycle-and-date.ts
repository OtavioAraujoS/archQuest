import {
  durationToIso,
  parseIsoDuration,
  type TimerDuration,
} from './timer-duration'

export interface TimerCycle {
  repetitions?: number
  interval: TimerDuration
}

const ISO_CYCLE = /^R(\d*)\/(.+)$/
const LOCAL_ISO_DATE_TIME = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::00)?$/

export function cycleToIso({ repetitions, interval }: TimerCycle) {
  return `R${repetitions ?? ''}/${durationToIso(interval)}`
}

export function parseIsoCycle(isoCycle: string): TimerCycle | undefined {
  const match = ISO_CYCLE.exec(isoCycle.trim())
  if (!match) return undefined

  const [, repetitions, isoInterval] = match
  const interval = parseIsoDuration(isoInterval)
  if (!interval) return undefined

  return { repetitions: repetitions ? Number(repetitions) : undefined, interval }
}

export function localDateTimeToIso(localDateTime: string) {
  return `${localDateTime}:00`
}

export function parseIsoLocalDateTime(isoDateTime: string) {
  return LOCAL_ISO_DATE_TIME.exec(isoDateTime.trim())?.[1]
}
