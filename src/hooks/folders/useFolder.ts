import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useGuardedChange } from '@/hooks/ui/useGuardedChange'
import type { FolderRecord } from '@/lib/db'
import { useCurrentDiagramOwnerId } from '@/lib/diagrams/diagram-owner'
import { moveDiagramToFolder } from '@/lib/diagrams/local-diagram-changes'
import * as cachedFolders from '@/lib/folders/cached-folders'
import { LIBRARY_PATH } from '@/lib/routes'

export const FOLDER_NAME_MAX_LENGTH = 80

export const INVALID_FOLDER_NAME_MESSAGE = `O nome da pasta precisa ter entre 1 e ${FOLDER_NAME_MAX_LENGTH} caracteres.`

export const FOLDER_CHANGE_FAILED_MESSAGE =
  'Não foi possível salvar a alteração na pasta. Confira a conexão e tente de novo.'

export type FolderDialog =
  | { kind: 'create' }
  | { kind: 'rename'; folder: FolderRecord }
  | { kind: 'delete'; folder: FolderRecord }

export function normalizeFolderName(typedName: string) {
  const name = typedName.trim().replaceAll(/\s+/g, ' ')
  if (name.length === 0 || name.length > FOLDER_NAME_MAX_LENGTH) return null
  return name
}

function useFolderFromRoute(folders: FolderRecord[] | undefined) {
  const { folderId } = useParams<{ folderId: string }>()
  const navigate = useNavigate()
  const currentFolder = folders?.find((folder) => folder.id === folderId)
  const isMissingFolder = Boolean(folderId && folders && !currentFolder)

  useEffect(() => {
    if (isMissingFolder) navigate(LIBRARY_PATH, { replace: true })
  }, [isMissingFolder, navigate])

  return {
    currentFolder: currentFolder ?? null,
    currentFolderId: currentFolder?.id ?? null,
    isOpeningFolder: Boolean(folderId && !currentFolder),
  }
}

export function useFolder() {
  const ownerId = useCurrentDiagramOwnerId()
  const folders = useLiveQuery(
    () => cachedFolders.listFoldersOf(ownerId),
    [ownerId],
  )
  const folderFromRoute = useFolderFromRoute(folders)
  const folderChange = useGuardedChange(FOLDER_CHANGE_FAILED_MESSAGE)
  const [folderDialog, setFolderDialog] = useState<FolderDialog | null>(null)

  function openFolderDialog(dialog: FolderDialog) {
    folderChange.dismissChangeError()
    setFolderDialog(dialog)
  }

  function closeFolderDialog() {
    if (folderChange.isChanging) return
    folderChange.dismissChangeError()
    setFolderDialog(null)
  }

  async function saveAndCloseDialog(change: () => Promise<unknown>) {
    const result = await folderChange.runGuardedChange(change)
    if (result !== null) setFolderDialog(null)
  }

  async function submitFolderName(typedName: string) {
    const name = normalizeFolderName(typedName)
    if (!name) return folderChange.showChangeError(INVALID_FOLDER_NAME_MESSAGE)
    const folderBeingRenamed =
      folderDialog?.kind === 'rename' ? folderDialog.folder : null
    await saveAndCloseDialog(() =>
      folderBeingRenamed
        ? cachedFolders.renameFolder(folderBeingRenamed.id, name)
        : cachedFolders.createFolder(name),
    )
  }

  async function confirmFolderDeletion() {
    if (folderDialog?.kind !== 'delete') return
    const folderId = folderDialog.folder.id
    await saveAndCloseDialog(() => cachedFolders.deleteFolder(folderId))
  }

  return {
    folders,
    ...folderFromRoute,
    folderDialog,
    folderError: folderChange.changeError,
    isSavingFolder: folderChange.isChanging,
    requestNewFolder: () => openFolderDialog({ kind: 'create' }),
    requestFolderRename: (folder: FolderRecord) =>
      openFolderDialog({ kind: 'rename', folder }),
    requestFolderDeletion: (folder: FolderRecord) =>
      openFolderDialog({ kind: 'delete', folder }),
    closeFolderDialog,
    submitFolderName,
    confirmFolderDeletion,
    moveDiagramToFolder: (diagramId: string, folderId: string | null) =>
      folderChange.runGuardedChange(() =>
        moveDiagramToFolder(diagramId, folderId),
      ),
  }
}
