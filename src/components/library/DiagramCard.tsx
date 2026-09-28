import { Folder } from 'lucide-react'

import type { DiagramCardActions } from '@/components/library/diagram-card-actions'
import { DiagramCardMenu } from '@/components/library/DiagramCardMenu'
import type { DiagramRecord } from '@/lib/db'
import {
  formatEditedAt,
  formatFullDateTime,
} from '@/lib/dates/format-edited-at'

interface DiagramCardProps {
  diagram: DiagramRecord
  actions: DiagramCardActions
}

export function DiagramCard({ diagram, actions }: Readonly<DiagramCardProps>) {
  const folderName = actions.showsFolderName
    ? actions.folders.find((folder) => folder.id === diagram.folderId)?.name
    : undefined

  return (
    <article className="group bg-card hover:border-primary/60 relative flex flex-col rounded-xl border transition-colors">
      <button
        type="button"
        onClick={() => actions.onOpen(diagram.id)}
        aria-label={`Abrir diagrama ${diagram.name}`}
        className="focus-visible:ring-ring/50 absolute inset-0 z-0 rounded-xl outline-none focus-visible:ring-[3px]"
      />
      <div
        aria-hidden="true"
        className="bg-muted/60 group-hover:bg-muted pointer-events-none flex aspect-video items-center justify-center overflow-hidden rounded-t-xl p-3 transition-colors dark:[&_svg]:hue-rotate-180 [&_*]:pointer-events-none! dark:[&_svg]:invert [&_svg]:h-auto [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: diagram.thumbnail ?? '' }}
      />
      <div className="flex items-center justify-between gap-2 border-t py-2 pr-2 pl-4">
        <div className="pointer-events-none min-w-0">
          <h3 className="truncate text-sm font-medium">{diagram.name}</h3>
          <p className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-xs">
            <time
              dateTime={new Date(diagram.updatedAt).toISOString()}
              title={formatFullDateTime(diagram.updatedAt)}
              className="shrink-0"
            >
              {formatEditedAt(diagram.updatedAt)}
            </time>
            {folderName && (
              <span className="flex min-w-0 items-center gap-1">
                <Folder className="size-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{folderName}</span>
              </span>
            )}
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <DiagramCardMenu diagram={diagram} actions={actions} />
        </div>
      </div>
    </article>
  )
}
