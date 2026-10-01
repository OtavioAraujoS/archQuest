import { DeleteFolderDialog } from '@/components/library/folders/DeleteFolderDialog'
import { FolderNameDialog } from '@/components/library/folders/FolderNameDialog'
import { countDiagramsInFolder } from '@/components/library/library-view'
import type { FolderDialog } from '@/types/library'
import type { DiagramRecord } from '@/lib/db'

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
      <DeleteFolderDialog
        folder={folderDialog.folder}
        diagramCount={countDiagramsInFolder(diagrams, folderDialog.folder.id)}
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
