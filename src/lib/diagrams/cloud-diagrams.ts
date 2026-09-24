import type { DiagramRow } from '@/lib/supabase/database-types'
import { requireSupabaseClient } from '@/lib/supabase/require-supabase-client'

export async function fetchAccountDiagramRows(): Promise<DiagramRow[]> {
  const supabase = await requireSupabaseClient()
  const { data, error } = await supabase
    .from('diagrams')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchCloudDiagramRow(id: string): Promise<DiagramRow | null> {
  const supabase = await requireSupabaseClient()
  const { data, error } = await supabase.from('diagrams').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function deleteCloudDiagram(id: string) {
  const supabase = await requireSupabaseClient()
  const { error } = await supabase.from('diagrams').delete().eq('id', id)
  if (error) throw error
}
