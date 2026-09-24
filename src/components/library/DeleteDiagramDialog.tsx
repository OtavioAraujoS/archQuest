import { Button } from '@/components/ui/button'
import { ModalDialog } from '@/components/ui/modal-dialog'
import type { DiagramRecord } from '@/lib/db'

interface DeleteDiagramDialogProps {
  diagram: DiagramRecord
  isDeleting: boolean
  deletionError: string | null
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteDiagramDialog({
  diagram,
  isDeleting,
  deletionError,
  onCancel,
  onConfirm,
}: Readonly<DeleteDiagramDialogProps>) {
  return (
    <ModalDialog
      title={`Excluir “${diagram.name}”?`}
      onClose={onCancel}
      isDismissible={!isDeleting}
      className="max-w-md"
    >
      <p className="text-muted-foreground text-sm">
        O diagrama sai da sua lista e essa ação não pode ser desfeita.
      </p>
      {deletionError && (
        <p role="alert" className="text-destructive mt-3 text-sm">
          {deletionError}
        </p>
      )}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Excluindo…' : 'Excluir diagrama'}
        </Button>
      </div>
    </ModalDialog>
  )
}
