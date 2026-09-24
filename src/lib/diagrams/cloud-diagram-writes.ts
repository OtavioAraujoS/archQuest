import type { DiagramInsert, DiagramRow, DiagramUpdate } from '@/lib/supabase/database-types'
import { requireSupabaseClient } from '@/lib/supabase/require-supabase-client'

const UNIQUE_VIOLATION_CODE = '23505'

export async function insertCloudDiagram(diagram: DiagramInsert): Promise<DiagramRow | null> {
  const supabase = await requireSupabaseClient()
  const { data, error } = await supabase.from('diagrams').insert(diagram).select().single()
  if (error?.code === UNIQUE_VIOLATION_CODE) return null
  if (error) throw error
  return data
}

export async function updateCloudDiagramAtVersion(
  id: string,
  expectedVersion: number,
  changes: DiagramUpdate,
): Promise<DiagramRow | null> {
  const supabase = await requireSupabaseClient()
  const { data, error } = await supabase
    .from('diagrams')
    .update(changes)
    .eq('id', id)
    .eq('version', expectedVersion)
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}
