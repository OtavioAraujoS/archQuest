import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  insertCloudDiagram,
  updateCloudDiagramAtVersion,
} from '@/lib/diagrams/cloud-diagram-writes'
import { makeDiagramRow } from './diagram-fixtures'
import { createFakeDiagramsQuery } from './fake-diagrams-query'

const { getSupabaseClient } = vi.hoisted(() => ({ getSupabaseClient: vi.fn() }))

vi.mock('@/lib/supabase/supabase-client', () => ({ getSupabaseClient }))

const NEW_DIAGRAM = { id: 'account-1', name: 'Novo', bpmn_xml: '<xml />' }

describe('cloud diagram writes', () => {
  beforeEach(() => {
    getSupabaseClient.mockReset()
  })

  it('inserts a diagram and returns the stored row', async () => {
    const query = createFakeDiagramsQuery(getSupabaseClient, {
      data: makeDiagramRow({ version: 1 }),
      error: null,
    })

    await expect(insertCloudDiagram(NEW_DIAGRAM)).resolves.toMatchObject({ version: 1 })
    expect(query.insert).toHaveBeenCalledWith(NEW_DIAGRAM)
  })

  it('treats an id that already exists in the cloud as a conflict', async () => {
    createFakeDiagramsQuery(getSupabaseClient, { data: null, error: { code: '23505' } })

    await expect(insertCloudDiagram(NEW_DIAGRAM)).resolves.toBeNull()
  })

  it('updates only the row at the expected version', async () => {
    const query = createFakeDiagramsQuery(getSupabaseClient, {
      data: makeDiagramRow({ version: 4 }),
      error: null,
    })

    await expect(
      updateCloudDiagramAtVersion('account-1', 3, { name: 'Renomeado' }),
    ).resolves.toMatchObject({ version: 4 })
    expect(query.update).toHaveBeenCalledWith({ name: 'Renomeado' })
    expect(query.eq).toHaveBeenCalledWith('id', 'account-1')
    expect(query.eq).toHaveBeenCalledWith('version', 3)
  })

  it('returns nothing when no row matches the expected version', async () => {
    createFakeDiagramsQuery(getSupabaseClient, { data: null, error: null })

    await expect(updateCloudDiagramAtVersion('account-1', 3, {})).resolves.toBeNull()
  })

  it('rethrows any other error for a retry', async () => {
    const checkViolation = { code: '23514', message: 'violates check constraint' }
    createFakeDiagramsQuery(getSupabaseClient, { data: null, error: checkViolation })

    await expect(insertCloudDiagram(NEW_DIAGRAM)).rejects.toBe(checkViolation)
  })
})
