import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LIBRARY_PATH } from '@/lib/routes'

export function FolderBreadcrumb({
  folderName,
}: Readonly<{ folderName: string }>) {
  return (
    <nav aria-label="Caminho">
      <ol className="text-muted-foreground flex min-w-0 items-center gap-1 text-sm">
        <li className="shrink-0">
          <Link
            to={LIBRARY_PATH}
            className="hover:text-foreground rounded-sm underline-offset-4 hover:underline"
          >
            Meus diagramas
          </Link>
        </li>
        <li aria-hidden="true" className="shrink-0">
          <ChevronRight className="size-4" />
        </li>
        <li aria-current="page" className="text-foreground truncate">
          {folderName}
        </li>
      </ol>
    </nav>
  )
}
