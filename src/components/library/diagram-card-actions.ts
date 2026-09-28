import type { DiagramRecord, FolderRecord } from '@/lib/db'

export interface DiagramCardActions {
  folders: FolderRecord[]
  showsFolderName: boolean
  onOpen: (id: string) => void
  onDelete: (diagram: DiagramRecord) => void
  onMoveToFolder: (diagram: DiagramRecord, folderId: string | null) => void
}
