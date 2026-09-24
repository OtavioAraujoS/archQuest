import type { Session, User } from '@supabase/supabase-js'
import { vi } from 'vitest'

type AuthStateListener = (event: string, session: Session | null) => void

export function createGitHubUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    email: 'dev@example.com',
    app_metadata: { provider: 'github' },
    user_metadata: {
      user_name: 'devhub',
      full_name: 'Dev Hub',
      avatar_url: 'https://avatars.example.com/devhub.png',
    },
    aud: 'authenticated',
    created_at: '2026-09-24T00:00:00Z',
    ...overrides,
  } as User
}

export function createSession(user: User = createGitHubUser()): Session {
  return { user } as Session
}

export function createFakeSupabaseAuth() {
  const listeners = new Set<AuthStateListener>()
  const unsubscribe = vi.fn()

  const auth = {
    onAuthStateChange: vi.fn((listener: AuthStateListener) => {
      listeners.add(listener)
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              unsubscribe()
              listeners.delete(listener)
            },
          },
        },
      }
    }),
    signInWithOAuth: vi.fn(async () => ({ data: {}, error: null })),
    signInWithOtp: vi.fn(async () => ({ data: {}, error: null })),
    signOut: vi.fn(async () => ({ error: null })),
  }

  function emitAuthStateChange(event: string, session: Session | null) {
    for (const listener of listeners) listener(event, session)
  }

  return { client: { auth }, auth, unsubscribe, emitAuthStateChange }
}
