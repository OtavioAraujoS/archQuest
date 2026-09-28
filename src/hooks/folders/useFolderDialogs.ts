import { useState } from 'react'

import type { useFolder } from '@/hooks/folders/useFolder'
import type { FolderRecord } from '@/lib/db'

export type FolderDialog =
  | { kind: 'create' }
  | { kind: 'rename'; folder: FolderRecord }
  | { kind: 'delete'; folder: FolderRecord }

type FolderActions = ReturnType<typeof useFolder>

export function useFolderDialogs(folderActions: FolderActions) {
  const [folderDialog, setFolderDialog] = useState<FolderDialog | null>(null)

  function openFolderDialog(dialog: FolderDialog) {
    folderActions.dismissFolderError()
    setFolderDialog(dialog)
  }

  function closeWhenSaved(result: unknown) {
    if (result !== null) setFolderDialog(null)
  }

  async function submitFolderName(typedName: string) {
    if (folderDialog?.kind === 'rename') {
      closeWhenSaved(
        await folderActions.renameFolder(folderDialog.folder.id, typedName),
      )
    } else {
      closeWhenSaved(await folderActions.createFolder(typedName))
    }
  }

  async function confirmFolderDeletion() {
    if (folderDialog?.kind !== 'delete') return
    closeWhenSaved(await folderActions.deleteFolder(folderDialog.folder.id))
  }

  function closeFolderDialog() {
    if (folderActions.isSavingFolder) return
    folderActions.dismissFolderError()
    setFolderDialog(null)
  }

  return {
    folderDialog,
    requestNewFolder: () => openFolderDialog({ kind: 'create' }),
    requestFolderRename: (folder: FolderRecord) =>
      openFolderDialog({ kind: 'rename', folder }),
    requestFolderDeletion: (folder: FolderRecord) =>
      openFolderDialog({ kind: 'delete', folder }),
    closeFolderDialog,
    submitFolderName,
    confirmFolderDeletion,
  }
}
