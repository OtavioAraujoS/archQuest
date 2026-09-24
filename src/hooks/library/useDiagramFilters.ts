import { useState } from 'react'

import {
  filterAndSortDiagrams,
  type DiagramSortOrder,
} from '@/components/library/filter-and-sort-diagrams'
import type { DiagramRecord } from '@/lib/db'

export function useDiagramFilters() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] =
    useState<DiagramSortOrder>('recently-edited')

  function applyFilters(diagrams: DiagramRecord[] | undefined) {
    return diagrams && filterAndSortDiagrams(diagrams, searchQuery, sortOrder)
  }

  return {
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    isSearching: searchQuery.trim() !== '',
    clearSearch: () => setSearchQuery(''),
    applyFilters,
  }
}
