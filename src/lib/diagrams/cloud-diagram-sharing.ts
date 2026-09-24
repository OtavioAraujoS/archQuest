import { requireSupabaseClient } from '@/lib/supabase/require-supabase-client'

export async function setCloudPublicSlug(id: string, publicSlug: string | null) {
  const supabase = await requireSupabaseClient()
  const { data, error } = await supabase
    .from('diagrams')
    .update({ public_slug: publicSlug })
    .eq('id', id)
    .select('public_slug')
    .single()
  if (error) throw error
  return data.public_slug
}
