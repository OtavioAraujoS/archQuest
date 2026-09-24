import type { Session } from '@supabase/supabase-js'

import { useAuthStore } from '@/lib/auth/auth-store'
import { toAuthUser } from '@/lib/auth/auth-user'
import { isCloudEnabled } from '@/lib/supabase/cloud-config'
import { getSupabaseClient } from '@/lib/supabase/supabase-client'

function applySession(session: Session | null) {
  useAuthStore.setState(
    session
      ? { status: 'signed-in', user: toAuthUser(session.user) }
      : { status: 'signed-out', user: null },
  )
}

export function startAuthSession(): () => void {
  if (!isCloudEnabled()) {
    useAuthStore.setState({ status: 'cloud-disabled', user: null })
    return () => {}
  }

  let isStopped = false
  let stopListening = () => {}

  getSupabaseClient()
    .then((supabase) => {
      if (!supabase || isStopped) return
      const { data } = supabase.auth.onAuthStateChange((_event, session) =>
        applySession(session),
      )
      stopListening = () => data.subscription.unsubscribe()
    })
    .catch(() => applySession(null))

  return () => {
    isStopped = true
    stopListening()
  }
}
