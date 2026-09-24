import type { PublicDiagram } from '@/lib/supabase/database-types'
import { getSupabaseClient } from '@/lib/supabase/supabase-client'

export async function fetchPublicDiagram(slug: string): Promise<PublicDiagram | null> {
  const supabase = await getSupabaseClient()
  if (!supabase) return null
  const { data, error } = await supabase.rpc('get_public_diagram', { requested_slug: slug })
  if (error) throw error
  return data[0] ?? null
}
