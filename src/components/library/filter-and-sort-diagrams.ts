import type { DiagramRecord } from '@/lib/db'

export type DiagramSortOrder = 'recently-edited' | 'recently-created' | 'name'

export const DIAGRAM_SORT_OPTIONS: {
  value: DiagramSortOrder
  label: string
}[] = [
  { value: 'recently-edited', label: 'Editados recentemente' },
  { value: 'recently-created', label: 'Criados recentemente' },
  { value: 'name', label: 'Nome (A–Z)' },
]

const DIAGRAM_COMPARATORS: Record<
  DiagramSortOrder,
  (first: DiagramRecord, second: DiagramRecord) => number
> = {
  'recently-edited': (first, second) => second.updatedAt - first.updatedAt,
  'recently-created': (first, second) => second.createdAt - first.createdAt,
  name: (first, second) =>
    first.name.localeCompare(second.name, 'pt-BR', { sensitivity: 'base' }),
}

export function normalizeForSearch(text: string) {
  return text
    .normalize('NFD')
    .replaceAll(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function filterAndSortDiagrams(
  diagrams: DiagramRecord[],
  searchQuery: string,
  sortOrder: DiagramSortOrder,
) {
  const normalizedQuery = normalizeForSearch(searchQuery)
  return diagrams
    .filter((diagram) =>
      normalizeForSearch(diagram.name).includes(normalizedQuery),
    )
    .sort(DIAGRAM_COMPARATORS[sortOrder])
}
