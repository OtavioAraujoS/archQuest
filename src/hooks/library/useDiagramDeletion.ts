import { useState } from 'react'

import { useGuardedChange } from '@/hooks/ui/useGuardedChange'
import type { DiagramRecord } from '@/lib/db'
import { deleteDiagram } from '@/lib/diagrams/delete-diagram'

export const DELETION_FAILED_MESSAGE =
  'Não foi possível excluir o diagrama da nuvem. Confira a conexão e tente de novo.'

export function useDiagramDeletion() {
  const [diagramPendingDeletion, setDiagramPendingDeletion] =
    useState<DiagramRecord | null>(null)
  const deletion = useGuardedChange(DELETION_FAILED_MESSAGE)

  function requestDeletion(diagram: DiagramRecord) {
    deletion.dismissChangeError()
    setDiagramPendingDeletion(diagram)
  }

  function cancelDeletion() {
    if (deletion.isChanging) return
    setDiagramPendingDeletion(null)
    deletion.dismissChangeError()
  }

  async function confirmDeletion() {
    if (!diagramPendingDeletion) return
    const deletedDiagramId = diagramPendingDeletion.id
    const result = await deletion.runGuardedChange(async () => {
      await deleteDiagram(deletedDiagramId)
      return deletedDiagramId
    })
    if (result !== null) setDiagramPendingDeletion(null)
  }

  return {
    diagramPendingDeletion,
    isDeleting: deletion.isChanging,
    deletionError: deletion.changeError,
    requestDeletion,
    cancelDeletion,
    confirmDeletion,
  }
}
