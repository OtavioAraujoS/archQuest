import { Search, X } from 'lucide-react'

import {
  DIAGRAM_SORT_OPTIONS,
  type DiagramSortOrder,
} from '@/components/library/filter-and-sort-diagrams'

interface LibraryToolbarProps {
  searchQuery: string
  onSearchQueryChange: (searchQuery: string) => void
  sortOrder: DiagramSortOrder
  onSortOrderChange: (sortOrder: DiagramSortOrder) => void
  visibleDiagramCount: number
}

const FIELD_CLASS =
  'border-input bg-background h-9 rounded-md border text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'

function describeDiagramCount(count: number) {
  return count === 1 ? '1 diagrama' : `${count} diagramas`
}

export function LibraryToolbar({
  searchQuery,
  onSearchQueryChange,
  sortOrder,
  onSortOrderChange,
  visibleDiagramCount,
}: Readonly<LibraryToolbarProps>) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative sm:w-80">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Buscar pelo nome"
          aria-label="Buscar diagramas"
          className={`${FIELD_CLASS} w-full pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange('')}
            aria-label="Apagar texto da busca"
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 flex size-7 -translate-y-1/2 items-center justify-center rounded-sm"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
      <label className="text-muted-foreground flex items-center gap-2 text-sm">
        Ordenar por
        <select
          value={sortOrder}
          onChange={(event) =>
            onSortOrderChange(event.target.value as DiagramSortOrder)
          }
          className={`${FIELD_CLASS} text-foreground px-2`}
        >
          {DIAGRAM_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <output className="text-muted-foreground text-sm tabular-nums sm:ml-auto">
        {describeDiagramCount(visibleDiagramCount)}
      </output>
    </div>
  )
}
