import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { DiagramRecord } from '@/lib/db'

interface DiagramCardProps {
  diagram: DiagramRecord
  onOpen: (id: string) => void
  onDelete: (id: string) => void
}

export function DiagramCard({ diagram, onOpen, onDelete }: Readonly<DiagramCardProps>) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border transition-colors hover:border-ring">
      <button
        type="button"
        onClick={() => onOpen(diagram.id)}
        aria-label={`Abrir diagrama ${diagram.name}`}
        className="absolute inset-0 z-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div
        className="pointer-events-none flex h-36 items-center justify-center overflow-hidden bg-muted [&_svg]:h-full [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: diagram.thumbnail ?? '' }}
      />
      <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
        <div className="pointer-events-none min-w-0">
          <p className="truncate text-sm font-medium">{diagram.name}</p>
          <p className="text-muted-foreground text-xs">
            {new Date(diagram.updatedAt).toLocaleString()}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="relative z-10 shrink-0 opacity-0 group-hover:opacity-100"
          onClick={(event) => {
            event.stopPropagation()
            onDelete(diagram.id)
          }}
          aria-label="Excluir diagrama"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  )
}
