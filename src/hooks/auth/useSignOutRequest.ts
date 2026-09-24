import { useState } from 'react'

import { signOutOfThisDevice } from '@/lib/auth/sign-out-of-this-device'
import { listPendingUploads } from '@/lib/diagrams/diagram-lists'

const SIGN_OUT_FAILED_MESSAGE = 'Não foi possível sair. Confira a conexão e tente de novo.'

export function useSignOutRequest(ownerId: string | null) {
  const [pendingDiagramCount, setPendingDiagramCount] = useState<number | null>(null)
  const [ownerIdOfTheWarning, setOwnerIdOfTheWarning] = useState(ownerId)

  if (ownerIdOfTheWarning !== ownerId) {
    setOwnerIdOfTheWarning(ownerId)
    setPendingDiagramCount(null)
  }

  async function requestSignOut() {
    if (!ownerId) return
    try {
      const pendingDiagrams = await listPendingUploads(ownerId)
      if (pendingDiagrams.length > 0) {
        setPendingDiagramCount(pendingDiagrams.length)
        return
      }
      await signOutOfThisDevice()
    } catch {
      alert(SIGN_OUT_FAILED_MESSAGE)
    }
  }

  function closeSignOutDialog() {
    setPendingDiagramCount(null)
  }

  return { pendingDiagramCount, requestSignOut, closeSignOutDialog }
}
