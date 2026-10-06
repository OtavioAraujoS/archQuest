import { Folder, FolderOutput, MoreHorizontal, Trash2 } from 'lucide-react'

import { DropdownMenu } from '@/components/ui/dropdown-menu'
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu-item'
import type { DiagramRecord } from '@/lib/db'
import type { DiagramCardActions } from '@/types/library'

interface DiagramCardMenuProps {
  diagram: DiagramRecord
  actions: DiagramCardActions
}

export function DiagramCardMenu({
  diagram,
  actions,
}: Readonly<DiagramCardMenuProps>) {
  const otherFolders = actions.folders.filter(
    (folder) => folder.id !== diagram.folderId,
  )
  const isInFolder = actions.folders.some(
    (folder) => folder.id === diagram.folderId,
  )
  const canMove = otherFolders.length > 0 || isInFolder
  const menuLabel = `Ações do diagrama ${diagram.name}`

  return (
    <DropdownMenu
      isIconTrigger
      trigger={<MoreHorizontal />}
      triggerAriaLabel={menuLabel}
      triggerClassName="text-muted-foreground size-8"
      menuLabel={menuLabel}
    >
      {canMove && (
        <>
          <DropdownMenuLabel>Mover para</DropdownMenuLabel>
          {isInFolder && (
            <DropdownMenuItem
              onSelect={() => actions.onMoveToFolder(diagram, null)}
            >
              <FolderOutput /> Fora das pastas
            </DropdownMenuItem>
          )}
          {otherFolders.map((folder) => (
            <DropdownMenuItem
              key={folder.id}
              onSelect={() => actions.onMoveToFolder(diagram, folder.id)}
            >
              <Folder /> <span className="truncate">{folder.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
        </>
      )}
      <DropdownMenuItem onSelect={() => actions.onDelete(diagram)}>
        <Trash2 /> Excluir
      </DropdownMenuItem>
    </DropdownMenu>
  )
}
