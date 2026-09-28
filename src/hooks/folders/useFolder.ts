import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'

import { useCurrentDiagramOwnerId } from '@/lib/diagrams/diagram-owner'
import { moveDiagramToFolder } from '@/lib/diagrams/local-diagram-changes'
import * as cachedFolders from '@/lib/folders/cached-folders'

export const FOLDER_NAME_MAX_LENGTH = 80

export const INVALID_FOLDER_NAME_MESSAGE = `O nome da pasta precisa ter entre 1 e ${FOLDER_NAME_MAX_LENGTH} caracteres.`

export const FOLDER_CHANGE_FAILED_MESSAGE =
  'Não foi possível salvar a alteração na pasta. Confira a conexão e tente de novo.'

export function normalizeFolderName(typedName: string) {
  const name = typedName.trim().replaceAll(/\s+/g, ' ')
  if (name.length === 0 || name.length > FOLDER_NAME_MAX_LENGTH) return null
  return name
}

export function useFolder() {
  const ownerId = useCurrentDiagramOwnerId()
  const folders = useLiveQuery(
    () => cachedFolders.listFoldersOf(ownerId),
    [ownerId],
  )
  const [folderError, setFolderError] = useState<string | null>(null)
  const [isSavingFolder, setIsSavingFolder] = useState(false)

  async function runFolderChange<Result>(change: () => Promise<Result>) {
    setFolderError(null)
    setIsSavingFolder(true)
    try {
      return await change()
    } catch {
      setFolderError(FOLDER_CHANGE_FAILED_MESSAGE)
      return null
    } finally {
      setIsSavingFolder(false)
    }
  }

  async function runWithValidName<Result>(
    typedName: string,
    change: (name: string) => Promise<Result>,
  ) {
    const name = normalizeFolderName(typedName)
    if (name) return runFolderChange(() => change(name))
    setFolderError(INVALID_FOLDER_NAME_MESSAGE)
    return null
  }

  return {
    folders,
    folderError,
    isSavingFolder,
    createFolder: (typedName: string) =>
      runWithValidName(typedName, cachedFolders.createFolder),
    renameFolder: (folderId: string, typedName: string) =>
      runWithValidName(typedName, (name) =>
        cachedFolders.renameFolder(folderId, name),
      ),
    deleteFolder: (folderId: string) =>
      runFolderChange(() => cachedFolders.deleteFolder(folderId)),
    moveDiagramToFolder: (diagramId: string, folderId: string | null) =>
      runFolderChange(() => moveDiagramToFolder(diagramId, folderId)),
    dismissFolderError: () => setFolderError(null),
  }
}
