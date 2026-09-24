import { useAuthStore } from '@/lib/auth/auth-store'

export function currentDiagramOwnerId(): string | null {
  const { status, user } = useAuthStore.getState()
  return status === 'signed-in' && user ? user.id : null
}

export function useCurrentDiagramOwnerId(): string | null {
  return useAuthStore((state) =>
    state.status === 'signed-in' && state.user ? state.user.id : null,
  )
}
