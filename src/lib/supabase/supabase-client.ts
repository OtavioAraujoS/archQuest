import type { SupabaseClient } from '@supabase/supabase-js'

import { readCloudConfig } from '@/lib/supabase/cloud-config'
import type { Database } from '@/lib/supabase/database-types'

export type ArchQuestSupabaseClient = SupabaseClient<Database>

let supabaseClientPromise: Promise<ArchQuestSupabaseClient> | null = null

export function getSupabaseClient(): Promise<ArchQuestSupabaseClient | null> {
  const cloudConfig = readCloudConfig()
  if (!cloudConfig) return Promise.resolve(null)

  supabaseClientPromise ??= import('@supabase/supabase-js').then(
    ({ createClient }) =>
      createClient<Database>(cloudConfig.url, cloudConfig.anonKey, {
        auth: { flowType: 'pkce' },
      }),
  )
  return supabaseClientPromise
}
