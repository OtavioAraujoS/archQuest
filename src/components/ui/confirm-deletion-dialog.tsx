import { Button } from '@/components/ui/button'
import { DialogActions } from '@/components/ui/dialog-actions'
import { ErrorMessage } from '@/components/ui/error-message'
import { ModalDialog } from '@/components/ui/modal-dialog'

interface ConfirmDeletionDialogProps {
  title: string
  description: string
  confirmLabel: string
  error: string | null
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDeletionDialog({
  title,
  description,
  confirmLabel,
  error,
  isDeleting,
  onCancel,
  onConfirm,
}: Readonly<ConfirmDeletionDialogProps>) {
  return (
    <ModalDialog
      title={title}
      onClose={onCancel}
      isDismissible={!isDeleting}
      className="max-w-md"
    >
      <p className="text-muted-foreground text-sm">{description}</p>
      {error && <ErrorMessage className="mt-3">{error}</ErrorMessage>}
      <DialogActions>
        <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Excluindo…' : confirmLabel}
        </Button>
      </DialogActions>
    </ModalDialog>
  )
}
