import type { FolderRecord } from '@/lib/db'
import type { FolderRow, FolderUpsert } from '@/lib/supabase/database-types'
import { requireSupabaseClient } from '@/lib/supabase/require-supabase-client'

const CLOUD_FOLDERS_TABLE = 'diagram_folders'

function throwCloudError({ error }: { error: unknown }) {
  if (error) throw error
}

export function toCachedFolderRecord(row: FolderRow): FolderRecord {
  return {
    id: row.id,
    name: row.name,
    createdAt: Date.parse(row.created_at),
    updatedAt: Date.parse(row.updated_at),
    ownerId: row.owner_id,
    dirty: false,
  }
}

export function toFolderUpsert(folder: FolderRecord): FolderUpsert {
  return {
    id: folder.id,
    name: folder.name,
    created_at: new Date(folder.createdAt).toISOString(),
    updated_at: new Date(folder.updatedAt).toISOString(),
  }
}

export async function fetchAccountFolders(): Promise<FolderRecord[]> {
  const supabase = await requireSupabaseClient()
  const result = await supabase.from(CLOUD_FOLDERS_TABLE).select('*')
  throwCloudError(result)
  return (result.data ?? []).map(toCachedFolderRecord)
}

export async function upsertCloudFolder(folder: FolderRecord) {
  const supabase = await requireSupabaseClient()
  throwCloudError(
    await supabase.from(CLOUD_FOLDERS_TABLE).upsert(toFolderUpsert(folder)),
  )
}

export async function deleteCloudFolder(id: string) {
  const supabase = await requireSupabaseClient()
  throwCloudError(
    await supabase.from(CLOUD_FOLDERS_TABLE).delete().eq('id', id),
  )
}
