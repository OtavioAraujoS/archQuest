import { Button } from '@/components/ui/button'
import { DialogActions } from '@/components/ui/dialog-actions'
import { ErrorMessage } from '@/components/ui/error-message'
import { ModalDialog } from '@/components/ui/modal-dialog'
import type { FolderRecord } from '@/lib/db'

interface DeleteFolderDialogProps {
  folder: FolderRecord
  diagramCount: number
  error: string | null
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

function describeWhatHappens(diagramCount: number) {
  if (diagramCount === 0) return 'A pasta está vazia.'
  if (diagramCount === 1) {
    return 'O diagrama desta pasta volta para Meus diagramas. Nenhum diagrama é excluído.'
  }
  return `Os ${diagramCount} diagramas desta pasta voltam para Meus diagramas. Nenhum diagrama é excluído.`
}

export function DeleteFolderDialog({
  folder,
  diagramCount,
  error,
  isDeleting,
  onCancel,
  onConfirm,
}: Readonly<DeleteFolderDialogProps>) {
  return (
    <ModalDialog
      title={`Excluir a pasta “${folder.name}”?`}
      onClose={onCancel}
      isDismissible={!isDeleting}
      className="max-w-md"
    >
      <p className="text-muted-foreground text-sm">
        {describeWhatHappens(diagramCount)}
      </p>
      {error && <ErrorMessage className="mt-3">{error}</ErrorMessage>}
      <DialogActions>
        <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Excluindo…' : 'Excluir pasta'}
        </Button>
      </DialogActions>
    </ModalDialog>
  )
}
