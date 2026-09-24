import type { ReactNode } from 'react'

import { DiagramCard } from '@/components/library/DiagramCard'
import type { DiagramRecord } from '@/lib/db'

interface DiagramGridProps {
  diagrams: DiagramRecord[] | undefined
  emptyState: ReactNode
  onOpen: (id: string) => void
  onDelete: (diagram: DiagramRecord) => void
}

const GRID_CLASS = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
const LOADING_PLACEHOLDER_COUNT = 3

export function DiagramGrid({
  diagrams,
  emptyState,
  onOpen,
  onDelete,
}: Readonly<DiagramGridProps>) {
  if (!diagrams) {
    return (
      <div
        aria-busy="true"
        aria-label="Carregando diagramas"
        className={GRID_CLASS}
      >
        {Array.from({ length: LOADING_PLACEHOLDER_COUNT }, (_, index) => (
          <div
            key={index}
            className="bg-muted/60 aspect-16/11 animate-pulse rounded-xl"
          />
        ))}
      </div>
    )
  }

  if (diagrams.length === 0) return emptyState

  return (
    <ul className={GRID_CLASS}>
      {diagrams.map((diagram) => (
        <li key={diagram.id}>
          <DiagramCard diagram={diagram} onOpen={onOpen} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  )
}
