import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { rememberGuestMigrationAnswer } from '@/lib/diagrams/guest-migration-answer'
import {
  makeAccountDiagram,
  makeGuestDiagram,
  OWNER_ID,
} from '../../lib/diagrams/diagram-fixtures'
import {
  signInAsDiagramOwner,
  signOutDiagramOwner,
} from '../../lib/diagrams/sign-in-as-owner'

vi.mock('@/lib/diagrams/pull-account-diagrams', () => ({
  pullAccountDiagrams: vi.fn(async () => {}),
}))
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => vi.fn(),
}))

import { renderDiagramLibrary } from './render-diagram-library'

const MIGRATION_DIALOG = { name: 'Levar diagramas para a sua conta' }

describe('DiagramLibrary guest migration', () => {
  beforeEach(async () => {
    localStorage.clear()
    await db.diagrams.clear()
  })

  afterEach(signOutDiagramOwner)

  it('offers to move guest diagrams right after signing in', async () => {
    await db.diagrams.add(makeGuestDiagram())
    signInAsDiagramOwner()

    renderDiagramLibrary()

    expect(
      await screen.findByRole('dialog', MIGRATION_DIALOG),
    ).toBeInTheDocument()
  })

  it('does not ask when there are no guest diagrams', async () => {
    await db.diagrams.add(makeAccountDiagram())
    signInAsDiagramOwner()

    renderDiagramLibrary()

    await screen.findByText('Processo na conta')
    expect(
      screen.queryByRole('dialog', MIGRATION_DIALOG),
    ).not.toBeInTheDocument()
  })

  it('does not ask while signed out', async () => {
    await db.diagrams.add(makeGuestDiagram())

    renderDiagramLibrary()

    await screen.findByText('Rascunho local')
    expect(
      screen.queryByRole('dialog', MIGRATION_DIALOG),
    ).not.toBeInTheDocument()
  })

  it('does not ask again after the user answered', async () => {
    await db.diagrams.add(makeGuestDiagram())
    rememberGuestMigrationAnswer(OWNER_ID)
    signInAsDiagramOwner()

    renderDiagramLibrary()

    await screen.findByRole('heading', { name: 'Só neste navegador' })
    expect(
      screen.queryByRole('dialog', MIGRATION_DIALOG),
    ).not.toBeInTheDocument()
  })

  it('can be reopened from the guest section', async () => {
    await db.diagrams.add(makeGuestDiagram())
    rememberGuestMigrationAnswer(OWNER_ID)
    signInAsDiagramOwner()
    renderDiagramLibrary()

    fireEvent.click(
      await screen.findByRole('button', { name: 'Enviar para a conta' }),
    )

    expect(screen.getByRole('dialog', MIGRATION_DIALOG)).toBeInTheDocument()
  })

  it('moves the diagram into the account section once sent', async () => {
    await db.diagrams.add(makeGuestDiagram())
    signInAsDiagramOwner()
    renderDiagramLibrary()

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Enviar 1 diagrama para a conta',
      }),
    )

    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Só neste navegador' }),
      ).not.toBeInTheDocument(),
    )
    expect(screen.getByText('Rascunho local')).toBeInTheDocument()
    await expect(db.diagrams.get('guest-1')).resolves.toMatchObject({
      ownerId: OWNER_ID,
    })
  })
})
