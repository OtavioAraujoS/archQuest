import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setCloudPublicSlug } from '@/lib/diagrams/cloud-diagram-sharing'
import { createFakeDiagramsQuery } from './fake-diagrams-query'

const { getSupabaseClient } = vi.hoisted(() => ({ getSupabaseClient: vi.fn() }))

vi.mock('@/lib/supabase/supabase-client', () => ({ getSupabaseClient }))

describe('setCloudPublicSlug', () => {
  beforeEach(() => {
    getSupabaseClient.mockReset()
  })

  it('changes only the public slug of the diagram and returns the stored value', async () => {
    const query = createFakeDiagramsQuery(getSupabaseClient, {
      data: { public_slug: 'slugPublicoComEntropia01' },
      error: null,
    })

    await expect(setCloudPublicSlug('account-1', 'slugPublicoComEntropia01')).resolves.toBe(
      'slugPublicoComEntropia01',
    )
    expect(query.update).toHaveBeenCalledWith({ public_slug: 'slugPublicoComEntropia01' })
    expect(query.eq).toHaveBeenCalledWith('id', 'account-1')
  })

  it('clears the slug to unpublish', async () => {
    const query = createFakeDiagramsQuery(getSupabaseClient, {
      data: { public_slug: null },
      error: null,
    })

    await expect(setCloudPublicSlug('account-1', null)).resolves.toBeNull()
    expect(query.update).toHaveBeenCalledWith({ public_slug: null })
  })

  it('rethrows the error reported by Supabase', async () => {
    const notFound = { code: 'PGRST116', message: 'no rows returned' }
    createFakeDiagramsQuery(getSupabaseClient, { data: null, error: notFound })

    await expect(setCloudPublicSlug('account-1', null)).rejects.toBe(notFound)
  })
})
