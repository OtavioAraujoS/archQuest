import { act } from '@testing-library/react'

import { INITIAL_AUTH_STATE, useAuthStore } from '@/lib/auth/auth-store'
import { OWNER_ID } from './diagram-fixtures'

export function signInAsDiagramOwner() {
  act(() =>
    useAuthStore.setState({
      status: 'signed-in',
      user: { id: OWNER_ID, email: null, displayName: 'dev', avatarUrl: null },
    }),
  )
}

export function signOutDiagramOwner() {
  act(() => useAuthStore.setState(INITIAL_AUTH_STATE))
}
