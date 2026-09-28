import { FolderCard } from '@/components/library/folders/FolderCard'
import { countDiagramsInFolder } from '@/components/library/library-view'
import type { DiagramRecord, FolderRecord } from '@/lib/db'

interface FolderGridProps {
  folders: FolderRecord[]
  diagrams: DiagramRecord[] | undefined
  onRename: (folder: FolderRecord) => void
  onDelete: (folder: FolderRecord) => void
}

export function FolderGrid({
  folders,
  diagrams,
  onRename,
  onDelete,
}: Readonly<FolderGridProps>) {
  if (folders.length === 0) return null

  return (
    <section aria-label="Pastas" className="flex flex-col gap-3">
      <h2 className="text-muted-foreground text-sm font-medium">Pastas</h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {folders.map((folder) => (
          <li key={folder.id}>
            <FolderCard
              folder={folder}
              diagramCount={countDiagramsInFolder(diagrams, folder.id)}
              onRename={onRename}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
