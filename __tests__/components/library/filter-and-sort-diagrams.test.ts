import { describe, expect, it } from 'vitest'

import {
  filterAndSortDiagrams,
  normalizeForSearch,
} from '@/components/library/filter-and-sort-diagrams'
import { makeLibraryDiagram } from './library-diagram-fixture'

const DIAGRAMS = [
  makeLibraryDiagram({
    id: 'b',
    name: 'Émissão de nota',
    createdAt: 2,
    updatedAt: 5,
  }),
  makeLibraryDiagram({
    id: 'a',
    name: 'atendimento',
    createdAt: 3,
    updatedAt: 1,
  }),
  makeLibraryDiagram({ id: 'c', name: 'Compras', createdAt: 1, updatedAt: 9 }),
]

function idsOf(diagrams: { id: string }[]) {
  return diagrams.map((diagram) => diagram.id)
}

describe('normalizeForSearch', () => {
  it('drops accents, case and surrounding spaces', () => {
    expect(normalizeForSearch('  Aprovação ÉPICA ')).toBe('aprovacao epica')
  })
})

describe('filterAndSortDiagrams', () => {
  it('keeps every diagram for an empty search', () => {
    expect(
      filterAndSortDiagrams(DIAGRAMS, '   ', 'recently-edited'),
    ).toHaveLength(3)
  })

  it('matches part of the name regardless of accents', () => {
    expect(idsOf(filterAndSortDiagrams(DIAGRAMS, 'emissao', 'name'))).toEqual([
      'b',
    ])
  })

  it('orders by last edit, by creation or by name', () => {
    expect(
      idsOf(filterAndSortDiagrams(DIAGRAMS, '', 'recently-edited')),
    ).toEqual(['c', 'b', 'a'])
    expect(
      idsOf(filterAndSortDiagrams(DIAGRAMS, '', 'recently-created')),
    ).toEqual(['a', 'b', 'c'])
    expect(idsOf(filterAndSortDiagrams(DIAGRAMS, '', 'name'))).toEqual([
      'a',
      'c',
      'b',
    ])
  })

  it('does not reorder the list it receives', () => {
    const originalOrder = idsOf(DIAGRAMS)

    filterAndSortDiagrams(DIAGRAMS, '', 'name')

    expect(idsOf(DIAGRAMS)).toEqual(originalOrder)
  })
})
