import { describe, expect, it } from 'vitest'

import { formatEditedAt } from '@/components/library/format-edited-at'

const NOW = new Date('2026-09-24T15:00:00-03:00').getTime()
const MINUTE_MS = 60_000

describe('formatEditedAt', () => {
  it('says "agora" for edits under a minute old', () => {
    expect(formatEditedAt(NOW - 30_000, NOW)).toBe('Editado agora')
  })

  it('counts minutes and hours for edits of the same day', () => {
    expect(formatEditedAt(NOW - 5 * MINUTE_MS, NOW)).toBe(
      'Editado há 5 minutos',
    )
    expect(formatEditedAt(NOW - 3 * 60 * MINUTE_MS, NOW)).toBe(
      'Editado há 3 horas',
    )
  })

  it('uses words such as "ontem" for recent days', () => {
    expect(formatEditedAt(NOW - 24 * 60 * MINUTE_MS, NOW)).toBe('Editado ontem')
  })

  it('shows the calendar date after a week', () => {
    const tenDaysAgo = NOW - 10 * 24 * 60 * MINUTE_MS

    expect(formatEditedAt(tenDaysAgo, NOW)).toMatch(
      /^Editado em 14 de set\.? de 2026$/,
    )
  })

  it('treats a timestamp in the future as just edited', () => {
    expect(formatEditedAt(NOW + 5 * MINUTE_MS, NOW)).toBe('Editado agora')
  })
})
