import { create } from 'zustand'

export type AuthStatus = 'cloud-disabled' | 'loading' | 'signed-out' | 'signed-in'

export interface AuthUser {
  id: string
  email: string | null
  displayName: string
  avatarUrl: string | null
}

export interface AuthState {
  status: AuthStatus
  user: AuthUser | null
}

export const INITIAL_AUTH_STATE: AuthState = { status: 'loading', user: null }

export const useAuthStore = create<AuthState>(() => INITIAL_AUTH_STATE)
