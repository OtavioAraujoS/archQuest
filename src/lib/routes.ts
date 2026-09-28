export const LANDING_PATH = '/'
export const LIBRARY_PATH = '/diagramas'
export const LIBRARY_FOLDER_PATH = '/diagramas/pastas/:folderId'

export function editorPath(diagramId: string) {
  return `/editor/${diagramId}`
}

export function libraryPathFor(folderId: string | null | undefined) {
  return folderId ? libraryFolderPath(folderId) : LIBRARY_PATH
}

export function libraryFolderPath(folderId: string) {
  return `/diagramas/pastas/${folderId}`
}
