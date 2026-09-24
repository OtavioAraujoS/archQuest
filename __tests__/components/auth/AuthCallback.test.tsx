import { act, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

import { AuthCallback } from '@/components/auth/AuthCallback'
import { INITIAL_AUTH_STATE, useAuthStore, type AuthState } from '@/lib/auth/auth-store'

const SIGNED_IN_STATE: AuthState = {
  status: 'signed-in',
  user: { id: 'user-1', email: null, displayName: 'devhub', avatarUrl: null },
}

function renderAuthCallback(authState: AuthState) {
  act(() => useAuthStore.setState(authState))
  render(
    <MemoryRouter initialEntries={['/auth/callback']}>
      <Routes>
        <Route path="/diagramas" element={<p>Biblioteca</p>} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AuthCallback', () => {
  afterEach(() => {
    act(() => useAuthStore.setState(INITIAL_AUTH_STATE))
    window.history.replaceState(null, '', '/')
  })

  it('waits while the session is being established', () => {
    renderAuthCallback(INITIAL_AUTH_STATE)

    expect(screen.getByText('Entrando…')).toBeInTheDocument()
  })

  it('returns to the library once signed in', () => {
    renderAuthCallback(SIGNED_IN_STATE)

    expect(screen.getByText('Biblioteca')).toBeInTheDocument()
  })

  it('returns to the library when the cloud is disabled', () => {
    renderAuthCallback({ status: 'cloud-disabled', user: null })

    expect(screen.getByText('Biblioteca')).toBeInTheDocument()
  })

  it('explains an expired or foreign-browser link when no session was created', () => {
    renderAuthCallback({ status: 'signed-out', user: null })

    expect(screen.getByRole('heading', { name: 'Não foi possível entrar' })).toBeInTheDocument()
    expect(screen.getByText(/expirou ou foi aberto em outro navegador/)).toBeInTheDocument()
  })

  it('shows the error description sent back by the provider', () => {
    window.history.replaceState(
      null,
      '',
      '/auth/callback?error=access_denied&error_description=The+user+denied+access',
    )

    renderAuthCallback(INITIAL_AUTH_STATE)

    expect(screen.getByText('The user denied access')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voltar para os diagramas' })).toBeInTheDocument()
  })
})
