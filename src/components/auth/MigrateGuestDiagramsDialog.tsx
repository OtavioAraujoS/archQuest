import { useState } from 'react'

import { GuestDiagramChecklist } from '@/components/auth/GuestDiagramChecklist'
import { Button } from '@/components/ui/button'
import { DialogActions } from '@/components/ui/dialog-actions'
import { ErrorMessage } from '@/components/ui/error-message'
import { ModalDialog } from '@/components/ui/modal-dialog'
import type { DiagramRecord } from '@/lib/db'
import { moveGuestDiagramsToAccount } from '@/lib/diagrams/move-guest-diagrams-to-account'

interface MigrateGuestDiagramsDialogProps {
  ownerId: string
  guestDiagrams: DiagramRecord[]
  onClose: () => void
}

function diagramCountLabel(count: number) {
  return count === 1 ? '1 diagrama' : `${count} diagramas`
}

export function MigrateGuestDiagramsDialog({
  ownerId,
  guestDiagrams,
  onClose,
}: Readonly<MigrateGuestDiagramsDialogProps>) {
  const [selectedDiagramIds, setSelectedDiagramIds] = useState<
    ReadonlySet<string>
  >(() => new Set(guestDiagrams.map((diagram) => diagram.id)))
  const [isMoving, setIsMoving] = useState(false)
  const [hasFailed, setHasFailed] = useState(false)

  function toggleDiagram(diagramId: string) {
    setSelectedDiagramIds((currentIds) => {
      const nextIds = new Set(currentIds)
      if (nextIds.has(diagramId)) nextIds.delete(diagramId)
      else nextIds.add(diagramId)
      return nextIds
    })
  }

  async function moveSelectedDiagrams() {
    setIsMoving(true)
    setHasFailed(false)
    try {
      await moveGuestDiagramsToAccount([...selectedDiagramIds], ownerId)
      onClose()
    } catch {
      setHasFailed(true)
      setIsMoving(false)
    }
  }

  return (
    <ModalDialog
      title="Levar diagramas para a sua conta"
      onClose={onClose}
      className="max-w-md"
    >
      <p className="text-muted-foreground mb-4 text-sm">
        Encontramos {diagramCountLabel(guestDiagrams.length)} criados neste
        navegador sem login. Os escolhidos vão para a sua conta e ficam
        disponíveis em outros dispositivos; os outros continuam só neste
        navegador.
      </p>
      <GuestDiagramChecklist
        guestDiagrams={guestDiagrams}
        selectedDiagramIds={selectedDiagramIds}
        onToggle={toggleDiagram}
      />
      {hasFailed && (
        <ErrorMessage className="mt-3">
          Não foi possível mover os diagramas. Tente de novo.
        </ErrorMessage>
      )}
      <DialogActions className="mt-5">
        <Button variant="ghost" onClick={onClose} disabled={isMoving}>
          Agora não
        </Button>
        <Button
          onClick={moveSelectedDiagrams}
          disabled={isMoving || selectedDiagramIds.size === 0}
        >
          {isMoving
            ? 'Enviando…'
            : `Enviar ${diagramCountLabel(selectedDiagramIds.size)} para a conta`}
        </Button>
      </DialogActions>
    </ModalDialog>
  )
}
