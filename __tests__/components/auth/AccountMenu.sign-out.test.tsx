import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AccountMenu } from '@/components/auth/AccountMenu'
import { useAuthStore } from '@/lib/auth/auth-store'
import { db } from '@/lib/db'
import { makeAccountDiagram, makeGuestDiagram } from '../../lib/diagrams/diagram-fixtures'
import {
  signInAsDiagramOwner,
  signOutDiagramOwner,
} from '../../lib/diagrams/sign-in-as-owner'

const { signOut } = vi.hoisted(() => ({ signOut: vi.fn() }))

vi.mock('@/lib/auth/auth-actions', () => ({
  signOut,
  signInWithGitHub: vi.fn(),
  sendMagicLink: vi.fn(),
}))

function clickSignOut() {
  fireEvent.click(screen.getByRole('button', { name: 'Sair' }))
}

describe('AccountMenu sign out', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    signOut.mockReset().mockImplementation(async () =>
      act(() => useAuthStore.setState({ status: 'signed-out', user: null })),
    )
    signInAsDiagramOwner()
  })

  afterEach(signOutDiagramOwner)

  it('signs out right away and forgets the account diagrams when nothing is pending', async () => {
    await db.diagrams.bulkAdd([makeAccountDiagram(), makeGuestDiagram()])
    render(<AccountMenu />)

    clickSignOut()

    await waitFor(() => expect(signOut).toHaveBeenCalledOnce())
    await waitFor(async () => {
      await expect(db.diagrams.get('account-1')).resolves.toBeUndefined()
    })
    await expect(db.diagrams.get('guest-1')).resolves.toBeDefined()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('asks first when some account diagrams have pending changes', async () => {
    await db.diagrams.add(makeAccountDiagram({ dirty: true }))
    render(<AccountMenu />)

    clickSignOut()

    expect(
      await screen.findByRole('dialog', { name: 'Sair com alterações pendentes?' }),
    ).toHaveTextContent('Você tem 1 diagrama')
    expect(signOut).not.toHaveBeenCalled()
  })

  it('does not reopen the warning on the next sign in after signing out', async () => {
    await db.diagrams.add(makeAccountDiagram({ dirty: true }))
    render(<AccountMenu />)
    clickSignOut()
    fireEvent.click(await screen.findByRole('button', { name: 'Sair mesmo assim' }))
    await screen.findByRole('button', { name: 'Entrar' })

    signInAsDiagramOwner()

    await act(() => Promise.resolve())
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
