import type { DiagramRecord, FolderRecord } from '@/lib/db'

export function diagramsInFolderView(
  diagrams: DiagramRecord[] | undefined,
  folders: FolderRecord[] | undefined,
  currentFolderId: string | null,
  isSearching: boolean,
) {
  if (!diagrams || !folders) return undefined
  if (currentFolderId) {
    return diagrams.filter((diagram) => diagram.folderId === currentFolderId)
  }
  if (isSearching) return diagrams
  const folderIds = new Set(folders.map((folder) => folder.id))
  return diagrams.filter(
    (diagram) => !diagram.folderId || !folderIds.has(diagram.folderId),
  )
}

export function countDiagramsInFolder(
  diagrams: DiagramRecord[] | undefined,
  folderId: string,
) {
  return (
    diagrams?.filter((diagram) => diagram.folderId === folderId).length ?? 0
  )
}

export function describeDiagramCount(count: number) {
  return count === 1 ? '1 diagrama' : `${count} diagramas`
}
