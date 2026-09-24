import { DiagramCard } from '@/components/library/DiagramCard'
import type { DiagramRecord } from '@/lib/db'

interface DiagramGridProps {
  diagrams: DiagramRecord[] | undefined
  emptyMessage: string
  onOpen: (id: string) => void
  onDelete: (id: string) => void
}

export function DiagramGrid({
  diagrams,
  emptyMessage,
  onOpen,
  onDelete,
}: Readonly<DiagramGridProps>) {
  if (diagrams?.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {diagrams?.map((diagram) => (
        <DiagramCard key={diagram.id} diagram={diagram} onOpen={onOpen} onDelete={onDelete} />
      ))}
    </div>
  )
}
