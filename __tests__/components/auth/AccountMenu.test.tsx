import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AccountMenu } from '@/components/auth/AccountMenu'
import { INITIAL_AUTH_STATE, useAuthStore, type AuthState } from '@/lib/auth/auth-store'

const { signOut } = vi.hoisted(() => ({ signOut: vi.fn(async () => {}) }))

vi.mock('@/lib/auth/auth-actions', () => ({
  signOut,
  signInWithGitHub: vi.fn(),
  sendMagicLink: vi.fn(),
}))

const SIGNED_IN_STATE: AuthState = {
  status: 'signed-in',
  user: {
    id: 'user-1',
    email: 'dev@example.com',
    displayName: 'devhub',
    avatarUrl: 'https://avatars.example.com/devhub.png',
  },
}

function renderAccountMenuWith(authState: AuthState) {
  act(() => useAuthStore.setState(authState))
  return render(<AccountMenu />)
}

describe('AccountMenu', () => {
  beforeEach(() => {
    signOut.mockClear()
  })

  afterEach(() => {
    act(() => useAuthStore.setState(INITIAL_AUTH_STATE))
  })

  it('renders nothing without the cloud configured', () => {
    const { container } = renderAccountMenuWith({ status: 'cloud-disabled', user: null })

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing while the session is loading', () => {
    const { container } = renderAccountMenuWith(INITIAL_AUTH_STATE)

    expect(container).toBeEmptyDOMElement()
  })

  it('offers to sign in when signed out and opens the login dialog', () => {
    renderAccountMenuWith({ status: 'signed-out', user: null })

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByRole('dialog', { name: 'Entrar no archQuest' })).toBeInTheDocument()
  })

  it('shows the signed-in user name', () => {
    renderAccountMenuWith(SIGNED_IN_STATE)

    expect(screen.getByText('devhub')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Entrar' })).not.toBeInTheDocument()
  })

  it('signs out through the sign out button', () => {
    renderAccountMenuWith(SIGNED_IN_STATE)

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }))

    expect(signOut).toHaveBeenCalledOnce()
  })
})
