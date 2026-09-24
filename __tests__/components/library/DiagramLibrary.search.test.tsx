import { fireEvent, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { makeLibraryDiagram } from './library-diagram-fixture'

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => vi.fn(),
}))

import { renderDiagramLibrary } from './render-diagram-library'

async function addSampleDiagrams() {
  await db.diagrams.bulkAdd([
    makeLibraryDiagram({
      id: 'purchase',
      name: 'Aprovação de compra',
      createdAt: 3,
      updatedAt: 10,
    }),
    makeLibraryDiagram({
      id: 'onboarding',
      name: 'Onboarding',
      createdAt: 1,
      updatedAt: 30,
    }),
    makeLibraryDiagram({
      id: 'billing',
      name: 'Cobrança',
      createdAt: 2,
      updatedAt: 20,
    }),
  ])
}

function listedDiagramNames() {
  return within(screen.getByRole('list'))
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent)
}

describe('DiagramLibrary search and sorting', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    await addSampleDiagrams()
  })

  it('lists the most recently edited diagrams first', async () => {
    renderDiagramLibrary()

    await screen.findByText('Onboarding')

    expect(listedDiagramNames()).toEqual([
      'Onboarding',
      'Cobrança',
      'Aprovação de compra',
    ])
    expect(screen.getByText('3 diagramas')).toBeInTheDocument()
  })

  it('filters by name ignoring accents and case', async () => {
    renderDiagramLibrary()
    await screen.findByText('Onboarding')

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Buscar diagramas' }),
      {
        target: { value: 'APROVACAO' },
      },
    )

    expect(listedDiagramNames()).toEqual(['Aprovação de compra'])
    expect(screen.getByText('1 diagrama')).toBeInTheDocument()
  })

  it('offers to clear a search without results', async () => {
    renderDiagramLibrary()
    await screen.findByText('Onboarding')

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Buscar diagramas' }),
      {
        target: { value: 'reembolso' },
      },
    )
    expect(
      screen.getByText('Nenhum diagrama encontrado para “reembolso”.'),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Limpar busca' }))

    expect(listedDiagramNames()).toHaveLength(3)
  })

  it('sorts by name when asked', async () => {
    renderDiagramLibrary()
    await screen.findByText('Onboarding')

    fireEvent.change(screen.getByRole('combobox', { name: 'Ordenar por' }), {
      target: { value: 'name' },
    })

    expect(listedDiagramNames()).toEqual([
      'Aprovação de compra',
      'Cobrança',
      'Onboarding',
    ])
  })
})
