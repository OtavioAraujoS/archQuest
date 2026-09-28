const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS
const RELATIVE_DAYS_LIMIT = 7

const relativeTimeFormat = new Intl.RelativeTimeFormat('pt-BR', {
  numeric: 'auto',
})
const calendarDateFormat = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})
const fullDateTimeFormat = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeStyle: 'short',
})

export function formatEditedAt(timestamp: number, now = Date.now()) {
  const elapsedMs = Math.max(0, now - timestamp)
  if (elapsedMs < MINUTE_MS) return 'Editado agora'
  if (elapsedMs < HOUR_MS) {
    const minutes = Math.floor(elapsedMs / MINUTE_MS)
    return `Editado ${relativeTimeFormat.format(-minutes, 'minute')}`
  }
  if (elapsedMs < DAY_MS) {
    const hours = Math.floor(elapsedMs / HOUR_MS)
    return `Editado ${relativeTimeFormat.format(-hours, 'hour')}`
  }
  const days = Math.floor(elapsedMs / DAY_MS)
  if (days < RELATIVE_DAYS_LIMIT) {
    return `Editado ${relativeTimeFormat.format(-days, 'day')}`
  }
  return `Editado em ${calendarDateFormat.format(timestamp)}`
}

export function formatFullDateTime(timestamp: number) {
  return fullDateTimeFormat.format(timestamp)
}
