import { FolderNameDialog } from '@/components/library/folders/FolderNameDialog'
import { countDiagramsInFolder } from '@/components/library/library-view'
import { ConfirmDeletionDialog } from '@/components/ui/confirm-deletion-dialog'
import type { DiagramRecord } from '@/lib/db'
import type { FolderDialog } from '@/types/library'

function describeFolderDeletion(diagramCount: number) {
  if (diagramCount === 0) return 'A pasta está vazia.'
  if (diagramCount === 1) {
    return 'O diagrama desta pasta volta para Meus diagramas. Nenhum diagrama é excluído.'
  }
  return `Os ${diagramCount} diagramas desta pasta voltam para Meus diagramas. Nenhum diagrama é excluído.`
}

interface FolderDialogsProps {
  folderDialog: FolderDialog | null
  diagrams: DiagramRecord[] | undefined
  error: string | null
  isSaving: boolean
  onClose: () => void
  onSubmitName: (typedName: string) => void
  onConfirmDeletion: () => void
}

export function FolderDialogs({
  folderDialog,
  diagrams,
  error,
  isSaving,
  onClose,
  onSubmitName,
  onConfirmDeletion,
}: Readonly<FolderDialogsProps>) {
  if (!folderDialog) return null

  if (folderDialog.kind === 'delete') {
    return (
      <ConfirmDeletionDialog
        title={`Excluir a pasta “${folderDialog.folder.name}”?`}
        description={describeFolderDeletion(
          countDiagramsInFolder(diagrams, folderDialog.folder.id),
        )}
        confirmLabel="Excluir pasta"
        error={error}
        isDeleting={isSaving}
        onCancel={onClose}
        onConfirm={onConfirmDeletion}
      />
    )
  }

  return (
    <FolderNameDialog
      currentName={
        folderDialog.kind === 'rename' ? folderDialog.folder.name : undefined
      }
      error={error}
      isSaving={isSaving}
      onCancel={onClose}
      onSubmit={onSubmitName}
    />
  )
}
