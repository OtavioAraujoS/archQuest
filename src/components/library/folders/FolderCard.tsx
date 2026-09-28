import { FolderClosed, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { describeDiagramCount } from '@/components/library/library-view'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu-item'
import type { FolderRecord } from '@/lib/db'
import { libraryFolderPath } from '@/lib/routes'

interface FolderCardProps {
  folder: FolderRecord
  diagramCount: number
  onRename: (folder: FolderRecord) => void
  onDelete: (folder: FolderRecord) => void
}

export function FolderCard({
  folder,
  diagramCount,
  onRename,
  onDelete,
}: Readonly<FolderCardProps>) {
  const menuLabel = `Ações da pasta ${folder.name}`

  return (
    <article className="group bg-card hover:border-primary/60 relative flex items-center gap-3 rounded-xl border py-3 pr-2 pl-4 transition-colors">
      <Link
        to={libraryFolderPath(folder.id)}
        aria-label={`Abrir pasta ${folder.name}`}
        className="focus-visible:ring-ring/50 absolute inset-0 rounded-xl outline-none focus-visible:ring-[3px]"
      />
      <FolderClosed
        className="text-primary pointer-events-none size-5 shrink-0"
        aria-hidden="true"
      />
      <div className="pointer-events-none min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium">{folder.name}</h3>
        <p className="text-muted-foreground text-xs">
          {describeDiagramCount(diagramCount)}
        </p>
      </div>
      <div className="relative z-10">
        <DropdownMenu
          isIconTrigger
          trigger={<MoreHorizontal />}
          triggerAriaLabel={menuLabel}
          triggerClassName="text-muted-foreground size-8"
          menuLabel={menuLabel}
        >
          <DropdownMenuItem onSelect={() => onRename(folder)}>
            <Pencil /> Renomear
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onDelete(folder)}>
            <Trash2 /> Excluir pasta
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </article>
  )
}
