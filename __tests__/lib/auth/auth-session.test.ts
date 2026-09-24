import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { startAuthSession } from '@/lib/auth/auth-session'
import { INITIAL_AUTH_STATE, useAuthStore } from '@/lib/auth/auth-store'
import { createFakeSupabaseAuth, createSession } from './fake-supabase-auth'

const { isCloudEnabled, getSupabaseClient } = vi.hoisted(() => ({
  isCloudEnabled: vi.fn(),
  getSupabaseClient: vi.fn(),
}))

vi.mock('@/lib/supabase/cloud-config', () => ({ isCloudEnabled }))
vi.mock('@/lib/supabase/supabase-client', () => ({ getSupabaseClient }))

async function startWithFakeSupabase() {
  const fakeSupabase = createFakeSupabaseAuth()
  isCloudEnabled.mockReturnValue(true)
  getSupabaseClient.mockResolvedValue(fakeSupabase.client)
  const stopAuthSession = startAuthSession()
  await vi.waitFor(() => expect(fakeSupabase.auth.onAuthStateChange).toHaveBeenCalled())
  return { ...fakeSupabase, stopAuthSession }
}

describe('startAuthSession', () => {
  beforeEach(() => {
    useAuthStore.setState(INITIAL_AUTH_STATE)
    vi.clearAllMocks()
  })

  afterEach(() => {
    useAuthStore.setState(INITIAL_AUTH_STATE)
  })

  it('marks the cloud as disabled and never loads Supabase without env', () => {
    isCloudEnabled.mockReturnValue(false)

    startAuthSession()

    expect(useAuthStore.getState()).toEqual({ status: 'cloud-disabled', user: null })
    expect(getSupabaseClient).not.toHaveBeenCalled()
  })

  it('stays loading until Supabase reports the initial session', async () => {
    await startWithFakeSupabase()

    expect(useAuthStore.getState().status).toBe('loading')
  })

  it('is signed out when the initial session is empty', async () => {
    const { emitAuthStateChange } = await startWithFakeSupabase()

    emitAuthStateChange('INITIAL_SESSION', null)

    expect(useAuthStore.getState()).toEqual({ status: 'signed-out', user: null })
  })

  it('is signed in with the GitHub profile when a session exists', async () => {
    const { emitAuthStateChange } = await startWithFakeSupabase()

    emitAuthStateChange('SIGNED_IN', createSession())

    expect(useAuthStore.getState()).toEqual({
      status: 'signed-in',
      user: {
        id: 'user-1',
        email: 'dev@example.com',
        displayName: 'devhub',
        avatarUrl: 'https://avatars.example.com/devhub.png',
      },
    })
  })

  it('goes back to signed out after a sign out event', async () => {
    const { emitAuthStateChange } = await startWithFakeSupabase()
    emitAuthStateChange('SIGNED_IN', createSession())

    emitAuthStateChange('SIGNED_OUT', null)

    expect(useAuthStore.getState().status).toBe('signed-out')
  })

  it('stops listening when stopped', async () => {
    const { stopAuthSession, unsubscribe } = await startWithFakeSupabase()

    stopAuthSession()

    expect(unsubscribe).toHaveBeenCalledOnce()
  })

  it('never subscribes when stopped before the client finishes loading', async () => {
    const fakeSupabase = createFakeSupabaseAuth()
    isCloudEnabled.mockReturnValue(true)
    getSupabaseClient.mockResolvedValue(fakeSupabase.client)

    startAuthSession()()
    await Promise.resolve()

    expect(fakeSupabase.auth.onAuthStateChange).not.toHaveBeenCalled()
  })

  it('falls back to signed out when the client cannot be loaded', async () => {
    isCloudEnabled.mockReturnValue(true)
    getSupabaseClient.mockRejectedValue(new Error('offline'))

    startAuthSession()

    await vi.waitFor(() => expect(useAuthStore.getState().status).toBe('signed-out'))
  })
})
