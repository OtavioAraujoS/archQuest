const ANSWER_KEY_PREFIX = 'archquest:guest-migration-answered:'

export function hasAnsweredGuestMigration(ownerId: string) {
  try {
    return localStorage.getItem(`${ANSWER_KEY_PREFIX}${ownerId}`) !== null
  } catch {
    return false
  }
}

export function rememberGuestMigrationAnswer(ownerId: string) {
  try {
    localStorage.setItem(`${ANSWER_KEY_PREFIX}${ownerId}`, new Date().toISOString())
  } catch {
    return
  }
}
