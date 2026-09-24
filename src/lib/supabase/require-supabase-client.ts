import { getSupabaseClient } from '@/lib/supabase/supabase-client'

export async function requireSupabaseClient() {
  const supabase = await getSupabaseClient()
  if (!supabase) throw new Error('A nuvem não está configurada neste ambiente.')
  return supabase
}
