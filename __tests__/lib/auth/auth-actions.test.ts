import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sendMagicLink, signInWithGitHub, signOut } from '@/lib/auth/auth-actions'
import { createFakeSupabaseAuth } from './fake-supabase-auth'

const { getSupabaseClient } = vi.hoisted(() => ({ getSupabaseClient: vi.fn() }))

vi.mock('@/lib/supabase/supabase-client', () => ({ getSupabaseClient }))

const AUTH_CALLBACK_URL = `${window.location.origin}/auth/callback`

describe('auth actions', () => {
  let fakeSupabase: ReturnType<typeof createFakeSupabaseAuth>

  beforeEach(() => {
    fakeSupabase = createFakeSupabaseAuth()
    getSupabaseClient.mockResolvedValue(fakeSupabase.client)
  })

  it('signs in with GitHub and returns to the auth callback', async () => {
    await signInWithGitHub()

    expect(fakeSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: { redirectTo: AUTH_CALLBACK_URL },
    })
  })

  it('sends a magic link that returns to the auth callback', async () => {
    await sendMagicLink('dev@example.com')

    expect(fakeSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'dev@example.com',
      options: { emailRedirectTo: AUTH_CALLBACK_URL },
    })
  })

  it('signs out', async () => {
    await signOut()

    expect(fakeSupabase.auth.signOut).toHaveBeenCalledOnce()
  })

  it('rethrows the error reported by Supabase', async () => {
    const rateLimitError = new Error('email rate limit exceeded')
    fakeSupabase.auth.signInWithOtp.mockResolvedValueOnce({ data: {}, error: rateLimitError } as never)

    await expect(sendMagicLink('dev@example.com')).rejects.toBe(rateLimitError)
  })

  it('refuses to act when the cloud is not configured', async () => {
    getSupabaseClient.mockResolvedValue(null)

    await expect(signInWithGitHub()).rejects.toThrow('A nuvem não está configurada')
  })
})
