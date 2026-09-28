import type { FolderRecord } from '@/lib/db'
import type { FolderRow } from '@/lib/supabase/database-types'
import { OWNER_ID } from '../diagrams/diagram-fixtures'

export function makeGuestFolder(
  overrides: Partial<FolderRecord> = {},
): FolderRecord {
  return {
    id: 'guest-folder',
    name: 'Rascunhos',
    createdAt: 1,
    updatedAt: 1,
    ownerId: null,
    dirty: false,
    ...overrides,
  }
}

export function makeAccountFolder(
  overrides: Partial<FolderRecord> = {},
): FolderRecord {
  return makeGuestFolder({
    id: 'account-folder',
    name: 'Financeiro',
    ownerId: OWNER_ID,
    ...overrides,
  })
}

export function makeFolderRow(overrides: Partial<FolderRow> = {}): FolderRow {
  return {
    id: 'account-folder',
    owner_id: OWNER_ID,
    name: 'Financeiro na nuvem',
    created_at: '2026-09-20T10:00:00.000Z',
    updated_at: '2026-09-24T10:00:00.000Z',
    ...overrides,
  }
}
