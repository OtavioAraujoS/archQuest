import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  deleteCloudFolder,
  fetchAccountFolders,
  upsertCloudFolder,
} from '@/lib/folders/cloud-folders'
import {
  createFakeDiagramsQuery,
  type FakeQueryResult,
} from '../diagrams/fake-diagrams-query'
import { makeAccountFolder, makeFolderRow } from './folder-fixtures'

const { getSupabaseClient } = vi.hoisted(() => ({ getSupabaseClient: vi.fn() }))

vi.mock('@/lib/supabase/supabase-client', () => ({ getSupabaseClient }))

function createFakeFoldersQuery(result: FakeQueryResult) {
  return createFakeDiagramsQuery(getSupabaseClient, result)
}

describe('cloud folders', () => {
  beforeEach(() => {
    getSupabaseClient.mockReset()
  })

  it('fetches the account folders as clean cached records', async () => {
    createFakeFoldersQuery({ data: [makeFolderRow()], error: null })

    await expect(fetchAccountFolders()).resolves.toEqual([
      makeAccountFolder({
        name: 'Financeiro na nuvem',
        createdAt: Date.parse('2026-09-20T10:00:00.000Z'),
        updatedAt: Date.parse('2026-09-24T10:00:00.000Z'),
      }),
    ])
  })

  it('upserts a folder with ISO dates', async () => {
    const query = createFakeFoldersQuery({ error: null })

    await upsertCloudFolder(makeAccountFolder({ createdAt: 0, updatedAt: 0 }))

    expect(query.upsert).toHaveBeenCalledWith({
      id: 'account-folder',
      name: 'Financeiro',
      created_at: '1970-01-01T00:00:00.000Z',
      updated_at: '1970-01-01T00:00:00.000Z',
    })
  })

  it('deletes one folder by id', async () => {
    const query = createFakeFoldersQuery({ error: null })

    await deleteCloudFolder('account-folder')

    expect(query.delete).toHaveBeenCalledOnce()
    expect(query.eq).toHaveBeenCalledWith('id', 'account-folder')
  })

  it('rethrows the error reported by Supabase', async () => {
    const permissionError = new Error('permission denied')
    createFakeFoldersQuery({ data: null, error: permissionError })

    await expect(fetchAccountFolders()).rejects.toBe(permissionError)
    await expect(deleteCloudFolder('account-folder')).rejects.toBe(
      permissionError,
    )
  })
})
