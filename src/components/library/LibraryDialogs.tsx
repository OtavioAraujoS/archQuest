import { MigrateGuestDiagramsDialog } from '@/components/auth/MigrateGuestDiagramsDialog'
import { DeleteDiagramDialog } from '@/components/library/DeleteDiagramDialog'
import { FolderDialogs } from '@/components/library/folders/FolderDialogs'
import { TemplatePicker } from '@/components/library/TemplatePicker'
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
        <DeleteDiagramDialog
          diagram={deletion.diagramPendingDeletion}
          isDeleting={deletion.isDeleting}
          deletionError={deletion.deletionError}
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
