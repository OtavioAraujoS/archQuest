import { Trash2 } from 'lucide-react'

import {
  formatEditedAt,
  formatFullDateTime,
} from '@/lib/dates/format-edited-at'
import { Button } from '@/components/ui/button'
import type { DiagramRecord } from '@/lib/db'

interface DiagramCardProps {
  diagram: DiagramRecord
  onOpen: (id: string) => void
  onDelete: (diagram: DiagramRecord) => void
}

export function DiagramCard({
  diagram,
  onOpen,
  onDelete,
}: Readonly<DiagramCardProps>) {
  return (
    <article className="group bg-card hover:border-primary/60 relative flex flex-col overflow-hidden rounded-xl border transition-colors">
      <button
        type="button"
        onClick={() => onOpen(diagram.id)}
        aria-label={`Abrir diagrama ${diagram.name}`}
        className="focus-visible:ring-ring/50 absolute inset-0 z-0 rounded-xl outline-none focus-visible:ring-[3px]"
      />
      <div
        aria-hidden="true"
        className="bg-muted/60 group-hover:bg-muted pointer-events-none flex aspect-video items-center justify-center overflow-hidden p-3 transition-colors dark:[&_svg]:hue-rotate-180 dark:[&_svg]:invert [&_svg]:h-auto [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: diagram.thumbnail ?? '' }}
      />
      <div className="flex items-center justify-between gap-2 border-t py-2 pr-2 pl-4">
        <div className="pointer-events-none min-w-0">
          <h3 className="truncate text-sm font-medium">{diagram.name}</h3>
          <time
            dateTime={new Date(diagram.updatedAt).toISOString()}
            title={formatFullDateTime(diagram.updatedAt)}
            className="text-muted-foreground text-xs"
          >
            {formatEditedAt(diagram.updatedAt)}
          </time>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive relative z-10 shrink-0"
          onClick={() => onDelete(diagram)}
          aria-label={`Excluir diagrama ${diagram.name}`}
        >
          <Trash2 />
        </Button>
      </div>
    </article>
  )
}
