import { describe, expect, it } from 'vitest'

import { durationToIso, parseIsoDuration, type TimerDuration } from './timer-duration'

const ROUND_TRIP_CASES: [TimerDuration, string][] = [
  [{ amount: 15, unit: 'minutes' }, 'PT15M'],
  [{ amount: 2, unit: 'hours' }, 'PT2H'],
  [{ amount: 3, unit: 'days' }, 'P3D'],
  [{ amount: 1, unit: 'weeks' }, 'P1W'],
]

describe('durationToIso and parseIsoDuration', () => {
  it.each(ROUND_TRIP_CASES)('converts %o to %s and back', (duration, iso) => {
    expect(durationToIso(duration)).toBe(iso)
    expect(parseIsoDuration(iso)).toEqual(duration)
  })

  it('ignores surrounding whitespace', () => {
    expect(parseIsoDuration('  PT30M ')).toEqual({ amount: 30, unit: 'minutes' })
  })

  it.each(['PT1H30M', 'P1DT2H', 'P1M', 'PT', 'P', '2 horas', '', 'PT1.5H'])(
    'does not represent %j in the friendly form',
    (unsupportedIso) => {
      expect(parseIsoDuration(unsupportedIso)).toBeUndefined()
    },
  )
})
