import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchPublicDiagram } from '@/lib/sharing/fetch-public-diagram'

const { getSupabaseClient, rpc } = vi.hoisted(() => ({
  getSupabaseClient: vi.fn(),
  rpc: vi.fn(),
}))

vi.mock('@/lib/supabase/supabase-client', () => ({ getSupabaseClient }))

const PUBLIC_DIAGRAM = {
  name: 'Reembolso',
  bpmn_xml: '<bpmn:definitions />',
  updated_at: '2026-09-24T10:00:00.000Z',
}

describe('fetchPublicDiagram', () => {
  beforeEach(() => {
    rpc.mockReset()
    getSupabaseClient.mockReset().mockResolvedValue({ rpc })
  })

  it('reads a published diagram through the public database function', async () => {
    rpc.mockResolvedValue({ data: [PUBLIC_DIAGRAM], error: null })

    await expect(fetchPublicDiagram('slugPublicoComEntropia01')).resolves.toEqual(PUBLIC_DIAGRAM)
    expect(rpc).toHaveBeenCalledWith('get_public_diagram', {
      requested_slug: 'slugPublicoComEntropia01',
    })
  })

  it('returns nothing for an unknown or unpublished slug', async () => {
    rpc.mockResolvedValue({ data: [], error: null })

    await expect(fetchPublicDiagram('slugQueNaoExisteNoBanco01')).resolves.toBeNull()
  })

  it('returns nothing when the cloud is not configured', async () => {
    getSupabaseClient.mockResolvedValue(null)

    await expect(fetchPublicDiagram('slugPublicoComEntropia01')).resolves.toBeNull()
  })

  it('rethrows the error reported by Supabase', async () => {
    const networkError = new Error('Failed to fetch')
    rpc.mockResolvedValue({ data: null, error: networkError })

    await expect(fetchPublicDiagram('slugPublicoComEntropia01')).rejects.toBe(networkError)
  })
})
