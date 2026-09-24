import { afterEach, describe, expect, it, vi } from 'vitest'

import { isCloudEnabled, readCloudConfig } from '@/lib/supabase/cloud-config'

describe('cloud config', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('is disabled when neither Supabase variable is set', () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')

    expect(isCloudEnabled()).toBe(false)
    expect(readCloudConfig()).toBeNull()
  })

  it('is disabled when only one Supabase variable is set', () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://project.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')

    expect(isCloudEnabled()).toBe(false)
  })

  it('is disabled when a variable holds only whitespace', () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://project.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '   ')

    expect(isCloudEnabled()).toBe(false)
  })

  it('is enabled and exposes the trimmed config when both variables are set', () => {
    vi.stubEnv('VITE_SUPABASE_URL', ' https://project.supabase.co ')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')

    expect(isCloudEnabled()).toBe(true)
    expect(readCloudConfig()).toEqual({
      url: 'https://project.supabase.co',
      anonKey: 'anon-key',
    })
  })
})
