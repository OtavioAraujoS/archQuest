import { getSupabaseClient } from '@/lib/supabase/supabase-client'

export const AUTH_CALLBACK_PATH = '/auth/callback'

function authCallbackUrl() {
  return `${window.location.origin}${AUTH_CALLBACK_PATH}`
}

async function requireSupabaseClient() {
  const supabase = await getSupabaseClient()
  if (!supabase) throw new Error('A nuvem não está configurada neste ambiente.')
  return supabase
}

export async function signInWithGitHub() {
  const supabase = await requireSupabaseClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: authCallbackUrl() },
  })
  if (error) throw error
}

export async function sendMagicLink(email: string) {
  const supabase = await requireSupabaseClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: authCallbackUrl() },
  })
  if (error) throw error
}

export async function signOut() {
  const supabase = await requireSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
