export const LANDING_PATH = '/'
export const LIBRARY_PATH = '/diagramas'
export const LIBRARY_FOLDER_PATH = '/diagramas/pastas/:folderId'

export function editorPath(diagramId: string) {
  return `/editor/${diagramId}`
}

export function libraryFolderPath(folderId: string) {
  return `/diagramas/pastas/${folderId}`
}
