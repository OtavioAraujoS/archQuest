import { create } from 'zustand'

interface LinkedFilesState {
  fileHandlesByDiagramId: Readonly<Record<string, FileSystemFileHandle>>
}

export const useLinkedFilesStore = create<LinkedFilesState>(() => ({
  fileHandlesByDiagramId: {},
}))

export function linkDiagramToFile(diagramId: string, handle: FileSystemFileHandle) {
  useLinkedFilesStore.setState((state) => ({
    fileHandlesByDiagramId: { ...state.fileHandlesByDiagramId, [diagramId]: handle },
  }))
}

export function unlinkDiagramFromFile(diagramId: string) {
  useLinkedFilesStore.setState((state) => {
    const { [diagramId]: _unlinkedHandle, ...remainingHandles } = state.fileHandlesByDiagramId
    return { fileHandlesByDiagramId: remainingHandles }
  })
}

export function linkedFileOf(diagramId: string): FileSystemFileHandle | undefined {
  return useLinkedFilesStore.getState().fileHandlesByDiagramId[diagramId]
}
