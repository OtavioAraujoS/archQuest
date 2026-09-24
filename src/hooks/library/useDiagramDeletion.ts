import { useState } from 'react'

import type { DiagramRecord } from '@/lib/db'
import { deleteDiagram } from '@/lib/diagrams/delete-diagram'

export const DELETION_FAILED_MESSAGE =
  'Não foi possível excluir o diagrama da nuvem. Confira a conexão e tente de novo.'

export function useDiagramDeletion() {
  const [diagramPendingDeletion, setDiagramPendingDeletion] =
    useState<DiagramRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletionError, setDeletionError] = useState<string | null>(null)

  function requestDeletion(diagram: DiagramRecord) {
    setDeletionError(null)
    setDiagramPendingDeletion(diagram)
  }

  function cancelDeletion() {
    if (isDeleting) return
    setDiagramPendingDeletion(null)
    setDeletionError(null)
  }

  async function confirmDeletion() {
    if (!diagramPendingDeletion) return
    setIsDeleting(true)
    setDeletionError(null)
    try {
      await deleteDiagram(diagramPendingDeletion.id)
      setDiagramPendingDeletion(null)
    } catch {
      setDeletionError(DELETION_FAILED_MESSAGE)
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    diagramPendingDeletion,
    isDeleting,
    deletionError,
    requestDeletion,
    cancelDeletion,
    confirmDeletion,
  }
}
