import { MigrateGuestDiagramsDialog } from '@/components/auth/MigrateGuestDiagramsDialog'
import { DeleteDiagramDialog } from '@/components/library/DeleteDiagramDialog'
import { FolderDialogs } from '@/components/library/folders/FolderDialogs'
import { TemplatePicker } from '@/components/library/TemplatePicker'
import type { useFolder } from '@/hooks/folders/useFolder'
import type { useFolderDialogs } from '@/hooks/folders/useFolderDialogs'
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
  folderActions: ReturnType<typeof useFolder>
  folderDialogs: ReturnType<typeof useFolderDialogs>
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
  folderActions,
  folderDialogs,
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
        <DeleteDiagramDialog
          diagram={deletion.diagramPendingDeletion}
          isDeleting={deletion.isDeleting}
          deletionError={deletion.deletionError}
          onCancel={deletion.cancelDeletion}
          onConfirm={() => void deletion.confirmDeletion()}
        />
      )}
      <FolderDialogs
        folderDialog={folderDialogs.folderDialog}
        diagrams={ownDiagrams}
        error={folderActions.folderError}
        isSaving={folderActions.isSavingFolder}
        onClose={folderDialogs.closeFolderDialog}
        onSubmitName={(typedName) =>
          void folderDialogs.submitFolderName(typedName)
        }
        onConfirmDeletion={() => void folderDialogs.confirmFolderDeletion()}
      />
    </>
  )
}
