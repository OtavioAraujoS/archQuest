import { requireSupabaseClient } from '@/lib/supabase/require-supabase-client'

export const AUTH_CALLBACK_PATH = '/auth/callback'

function authCallbackUrl() {
  return `${window.location.origin}${AUTH_CALLBACK_PATH}`
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
  const { error } = await supabase.auth.signOut({ scope: 'local' })
  if (error) throw error
}
