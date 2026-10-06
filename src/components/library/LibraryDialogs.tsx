import { MigrateGuestDiagramsDialog } from '@/components/auth/MigrateGuestDiagramsDialog'
import { FolderDialogs } from '@/components/library/folders/FolderDialogs'
import { TemplatePicker } from '@/components/library/TemplatePicker'
import { ConfirmDeletionDialog } from '@/components/ui/confirm-deletion-dialog'
import type { useFolder } from '@/hooks/folders/useFolder'
import type { useDiagramDeletion } from '@/hooks/library/useDiagramDeletion'
import type { DiagramRecord } from '@/lib/db'
import type { DiagramTemplate } from '@/templates'

interface LibraryDialogsProps {
  isTemplatePickerOpen: boolean
  onTemplateChosen: (template: DiagramTemplate) => void
  onCloseTemplatePicker: () => void
  guestMigrationOwnerId: string | null
  guestDiagrams: DiagramRecord[] | undefined
  onCloseGuestMigration: () => void
  deletion: ReturnType<typeof useDiagramDeletion>
  folder: ReturnType<typeof useFolder>
  ownDiagrams: DiagramRecord[] | undefined
}

export function LibraryDialogs({
  isTemplatePickerOpen,
  onTemplateChosen,
  onCloseTemplatePicker,
  guestMigrationOwnerId,
  guestDiagrams,
  onCloseGuestMigration,
  deletion,
  folder,
  ownDiagrams,
}: Readonly<LibraryDialogsProps>) {
  return (
    <>
      {isTemplatePickerOpen && (
        <TemplatePicker
          onTemplateChosen={onTemplateChosen}
          onClose={onCloseTemplatePicker}
        />
      )}
      {guestMigrationOwnerId && guestDiagrams && (
        <MigrateGuestDiagramsDialog
          ownerId={guestMigrationOwnerId}
          guestDiagrams={guestDiagrams}
          onClose={onCloseGuestMigration}
        />
      )}
      {deletion.diagramPendingDeletion && (
        <ConfirmDeletionDialog
          title={`Excluir “${deletion.diagramPendingDeletion.name}”?`}
          description="O diagrama sai da sua lista e essa ação não pode ser desfeita."
          confirmLabel="Excluir diagrama"
          isDeleting={deletion.isDeleting}
          error={deletion.deletionError}
          onCancel={deletion.cancelDeletion}
          onConfirm={() => void deletion.confirmDeletion()}
        />
      )}
      <FolderDialogs
        folderDialog={folder.folderDialog}
        diagrams={ownDiagrams}
        error={folder.folderError}
        isSaving={folder.isSavingFolder}
        onClose={folder.closeFolderDialog}
        onSubmitName={(typedName) => void folder.submitFolderName(typedName)}
        onConfirmDeletion={() => void folder.confirmFolderDeletion()}
      />
    </>
  )
}
