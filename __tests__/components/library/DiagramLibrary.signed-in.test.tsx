import { render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import {
  makeAccountDiagram,
  makeGuestDiagram,
  OWNER_ID,
} from '../../lib/diagrams/diagram-fixtures'
import {
  signInAsDiagramOwner,
  signOutDiagramOwner,
} from '../../lib/diagrams/sign-in-as-owner'

const { pullAccountDiagrams } = vi.hoisted(() => ({ pullAccountDiagrams: vi.fn() }))

vi.mock('@/lib/diagrams/pull-account-diagrams', () => ({ pullAccountDiagrams }))
vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))

import { DiagramLibrary } from '@/components/library/DiagramLibrary'

describe('DiagramLibrary signed in', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    pullAccountDiagrams.mockReset().mockResolvedValue(undefined)
    signInAsDiagramOwner()
  })

  afterEach(signOutDiagramOwner)

  it('pulls the account diagrams from the cloud when opened', async () => {
    render(<DiagramLibrary />)

    expect(pullAccountDiagrams).toHaveBeenCalledWith(OWNER_ID)
    expect(await screen.findByText(/salvos na sua conta/)).toBeInTheDocument()
  })

  it('lists the account diagrams from the cache', async () => {
    await db.diagrams.add(makeAccountDiagram())

    render(<DiagramLibrary />)

    expect(await screen.findByText('Processo na conta')).toBeInTheDocument()
  })

  it('shows guest diagrams apart, as only in this browser', async () => {
    await db.diagrams.bulkAdd([makeAccountDiagram(), makeGuestDiagram()])

    render(<DiagramLibrary />)

    const guestSection = (await screen.findByRole('heading', { name: 'Só neste navegador' }))
      .closest('section') as HTMLElement
    expect(within(guestSection).getByText('Rascunho local')).toBeInTheDocument()
    expect(within(guestSection).queryByText('Processo na conta')).not.toBeInTheDocument()
  })

  it('hides the guest section when there are no guest diagrams', async () => {
    await db.diagrams.add(makeAccountDiagram())

    render(<DiagramLibrary />)

    await screen.findByText('Processo na conta')
    expect(screen.queryByRole('heading', { name: 'Só neste navegador' })).not.toBeInTheDocument()
  })

  it('warns and keeps the cached copy when the cloud cannot be reached', async () => {
    await db.diagrams.add(makeAccountDiagram())
    pullAccountDiagrams.mockRejectedValue(new Error('offline'))

    render(<DiagramLibrary />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível buscar')
    expect(screen.getByText('Processo na conta')).toBeInTheDocument()
  })

  it('shows the account empty state once the cloud has nothing', async () => {
    render(<DiagramLibrary />)

    expect(await screen.findByText(/Nenhum diagrama na sua conta ainda/)).toBeInTheDocument()
  })
})
