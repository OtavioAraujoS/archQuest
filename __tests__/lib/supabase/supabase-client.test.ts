import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { createClient } = vi.hoisted(() => ({
  createClient: vi.fn(() => ({ fakeSupabaseClient: true })),
}))

vi.mock('@supabase/supabase-js', () => ({ createClient }))

async function importFreshSupabaseClientModule() {
  vi.resetModules()
  return import('@/lib/supabase/supabase-client')
}

describe('getSupabaseClient', () => {
  beforeEach(() => {
    createClient.mockClear()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns null and never creates a client without the Supabase variables', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    const { getSupabaseClient } = await importFreshSupabaseClientModule()

    await expect(getSupabaseClient()).resolves.toBeNull()
    expect(createClient).not.toHaveBeenCalled()
  })

  it('creates a PKCE client from the Supabase variables', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://project.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    const { getSupabaseClient } = await importFreshSupabaseClientModule()

    await expect(getSupabaseClient()).resolves.toEqual({ fakeSupabaseClient: true })
    expect(createClient).toHaveBeenCalledWith('https://project.supabase.co', 'anon-key', {
      auth: { flowType: 'pkce' },
    })
  })

  it('reuses the same client on later calls', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://project.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    const { getSupabaseClient } = await importFreshSupabaseClientModule()

    const firstClient = await getSupabaseClient()
    const secondClient = await getSupabaseClient()

    expect(secondClient).toBe(firstClient)
    expect(createClient).toHaveBeenCalledTimes(1)
  })
})
