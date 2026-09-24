import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  deleteCloudDiagram,
  fetchAccountDiagramRows,
  fetchCloudDiagramRow,
} from '@/lib/diagrams/cloud-diagrams'
import { makeDiagramRow } from './diagram-fixtures'

const { getSupabaseClient } = vi.hoisted(() => ({ getSupabaseClient: vi.fn() }))

vi.mock('@/lib/supabase/supabase-client', () => ({ getSupabaseClient }))

function createFakeDiagramsQuery(result: { data?: unknown; error: unknown }) {
  const query = {
    select: vi.fn(() => query),
    order: vi.fn(async () => result),
    eq: vi.fn(() => query),
    maybeSingle: vi.fn(async () => result),
    delete: vi.fn(() => query),
    then: (resolve: (value: unknown) => void) => resolve(result),
  }
  getSupabaseClient.mockResolvedValue({ from: vi.fn(() => query) })
  return query
}

describe('cloud diagrams', () => {
  beforeEach(() => {
    getSupabaseClient.mockReset()
  })

  it('fetches the account diagrams, most recently updated first', async () => {
    const query = createFakeDiagramsQuery({ data: [makeDiagramRow()], error: null })

    await expect(fetchAccountDiagramRows()).resolves.toEqual([makeDiagramRow()])
    expect(query.order).toHaveBeenCalledWith('updated_at', { ascending: false })
  })

  it('fetches one diagram by id', async () => {
    const query = createFakeDiagramsQuery({ data: makeDiagramRow(), error: null })

    await expect(fetchCloudDiagramRow('account-1')).resolves.toEqual(makeDiagramRow())
    expect(query.eq).toHaveBeenCalledWith('id', 'account-1')
  })

  it('deletes one diagram by id', async () => {
    const query = createFakeDiagramsQuery({ error: null })

    await deleteCloudDiagram('account-1')

    expect(query.delete).toHaveBeenCalledOnce()
    expect(query.eq).toHaveBeenCalledWith('id', 'account-1')
  })

  it('rethrows the error reported by Supabase', async () => {
    const permissionError = new Error('permission denied')
    createFakeDiagramsQuery({ data: null, error: permissionError })

    await expect(fetchAccountDiagramRows()).rejects.toBe(permissionError)
  })

  it('refuses to run without the cloud configured', async () => {
    getSupabaseClient.mockResolvedValue(null)

    await expect(fetchAccountDiagramRows()).rejects.toThrow('A nuvem não está configurada')
  })
})
