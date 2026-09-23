import { describe, expect, it } from 'vitest'

import {
  cycleToIso,
  localDateTimeToIso,
  parseIsoCycle,
  parseIsoLocalDateTime,
} from './timer-cycle-and-date'

describe('cycleToIso and parseIsoCycle', () => {
  it('converts a limited cycle and back', () => {
    const cycle = { repetitions: 3, interval: { amount: 10, unit: 'minutes' as const } }

    expect(cycleToIso(cycle)).toBe('R3/PT10M')
    expect(parseIsoCycle('R3/PT10M')).toEqual(cycle)
  })

  it('converts an endless cycle and back', () => {
    const cycle = { interval: { amount: 1, unit: 'days' as const } }

    expect(cycleToIso(cycle)).toBe('R/P1D')
    expect(parseIsoCycle('R/P1D')).toEqual({ repetitions: undefined, ...cycle })
  })

  it.each([
    'R3/2026-01-01T00:00:00/PT1H',
    'R3/PT1H30M',
    'PT10M',
    '0 0 9 * * ?',
  ])('does not represent %j in the friendly form', (unsupportedCycle) => {
    expect(parseIsoCycle(unsupportedCycle)).toBeUndefined()
  })
})

describe('localDateTimeToIso and parseIsoLocalDateTime', () => {
  it('converts the datetime-local value and back', () => {
    expect(localDateTimeToIso('2026-10-01T09:30')).toBe('2026-10-01T09:30:00')
    expect(parseIsoLocalDateTime('2026-10-01T09:30:00')).toBe('2026-10-01T09:30')
    expect(parseIsoLocalDateTime('2026-10-01T09:30')).toBe('2026-10-01T09:30')
  })

  it.each([
    '2026-10-01T09:30:00Z',
    '2026-10-01T09:30:00-03:00',
    '2026-10-01T09:30:15',
    '2026-10-01',
    '${prazo}',
  ])('does not represent %j in the friendly form', (unsupportedDate) => {
    expect(parseIsoLocalDateTime(unsupportedDate)).toBeUndefined()
  })
})
