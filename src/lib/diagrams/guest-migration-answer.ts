import {
  readStoredValue,
  writeStoredValue,
} from '@/lib/storage/safe-local-storage'

const ANSWER_KEY_PREFIX = 'archquest:guest-migration-answered:'

export function hasAnsweredGuestMigration(ownerId: string) {
  return readStoredValue(`${ANSWER_KEY_PREFIX}${ownerId}`) !== null
}

export function rememberGuestMigrationAnswer(ownerId: string) {
  writeStoredValue(`${ANSWER_KEY_PREFIX}${ownerId}`, new Date().toISOString())
}
