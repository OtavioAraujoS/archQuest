import { useState } from 'react'

import type { DiagramRecord } from '@/lib/db'
import {
  hasAnsweredGuestMigration,
  rememberGuestMigrationAnswer,
} from '@/lib/diagrams/guest-migration-answer'

export function useGuestMigrationPrompt(
  ownerId: string | null,
  guestDiagrams: DiagramRecord[] | undefined,
) {
  const [isOpenedByUser, setIsOpenedByUser] = useState(false)
  const [ownerIdThatAnswered, setOwnerIdThatAnswered] = useState<string | null>(null)

  const hasGuestDiagrams = (guestDiagrams?.length ?? 0) > 0
  const isAwaitingFirstAnswer =
    ownerId !== null &&
    ownerIdThatAnswered !== ownerId &&
    !hasAnsweredGuestMigration(ownerId)
  const isGuestMigrationOpen =
    ownerId !== null && hasGuestDiagrams && (isOpenedByUser || isAwaitingFirstAnswer)

  function openGuestMigration() {
    setIsOpenedByUser(true)
  }

  function closeGuestMigration() {
    if (ownerId) {
      rememberGuestMigrationAnswer(ownerId)
      setOwnerIdThatAnswered(ownerId)
    }
    setIsOpenedByUser(false)
  }

  return { isGuestMigrationOpen, openGuestMigration, closeGuestMigration }
}
