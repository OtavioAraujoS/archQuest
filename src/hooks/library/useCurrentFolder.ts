import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import type { FolderRecord } from '@/lib/db'
import { LIBRARY_PATH } from '@/lib/routes'

export function useCurrentFolder(folders: FolderRecord[] | undefined) {
  const { folderId } = useParams<{ folderId: string }>()
  const navigate = useNavigate()
  const currentFolder = folders?.find((folder) => folder.id === folderId)
  const isMissingFolder = Boolean(folderId && folders && !currentFolder)

  useEffect(() => {
    if (isMissingFolder) navigate(LIBRARY_PATH, { replace: true })
  }, [isMissingFolder, navigate])

  return {
    currentFolderId: currentFolder?.id ?? null,
    currentFolder: currentFolder ?? null,
    isOpeningFolder: Boolean(folderId && !currentFolder),
  }
}
