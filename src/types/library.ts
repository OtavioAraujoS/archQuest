import type { DiagramRecord, FolderRecord } from '@/lib/db'

export type CloudPullStatus = 'pulling' | 'pulled' | 'failed'

export type FolderDialog =
  | { kind: 'create' }
  | { kind: 'rename'; folder: FolderRecord }
  | { kind: 'delete'; folder: FolderRecord }

export type DiagramSortOrder = 'recently-edited' | 'recently-created' | 'name'

export interface LibraryViewInputs {
  ownerId: string | null
  accountDiagrams: DiagramRecord[] | undefined
  guestDiagrams: DiagramRecord[] | undefined
  folders: FolderRecord[] | undefined
  currentFolderId: string | null
  isOpeningFolder: boolean
  isSearching: boolean
  applyFilters: (
    diagrams: DiagramRecord[] | undefined,
  ) => DiagramRecord[] | undefined
}

export interface DiagramCardActions {
  folders: FolderRecord[]
  showsFolderName: boolean
  onOpen: (id: string) => void
  onDelete: (diagram: DiagramRecord) => void
  onMoveToFolder: (diagram: DiagramRecord, folderId: string | null) => void
}
