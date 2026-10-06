import { useAuthStore } from '@/lib/auth/auth-store'
import {
  onlyTerms,
  onUserTermsChange,
  replaceUserTerms,
  userAcceptedTerms,
} from '@/lib/spelling/accepted-terms'
import { requireSupabaseClient } from '@/lib/supabase/require-supabase-client'

export const ACCEPTED_TERMS_METADATA_KEY = 'accepted_terms'

export function startAcceptedTermsSyncWhileSignedIn(): () => void {
  let followedUserId: string | null = null
  let uploadingUserId: string | null = null

  async function uploadTerms() {
    if (!uploadingUserId) return
    try {
      const supabase = await requireSupabaseClient()
      const { error } = await supabase.auth.updateUser({
        data: { [ACCEPTED_TERMS_METADATA_KEY]: userAcceptedTerms() },
      })
      if (error) throw error
    } catch (error) {
      console.error('Failed to save the dictionary to the account', error)
    }
  }

  async function adoptAccountTerms(userId: string) {
    try {
      const supabase = await requireSupabaseClient()
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      if (followedUserId !== userId) return
      const stored: unknown =
        data.user.user_metadata?.[ACCEPTED_TERMS_METADATA_KEY]
      if (Array.isArray(stored)) replaceUserTerms(onlyTerms(stored))
      uploadingUserId = userId
      if (!Array.isArray(stored)) await uploadTerms()
    } catch (error) {
      console.error('Failed to load the dictionary from the account', error)
    }
  }

  function followSignedInUser() {
    const userId = useAuthStore.getState().user?.id ?? null
    if (userId === followedUserId) return
    followedUserId = userId
    uploadingUserId = null
    if (userId) void adoptAccountTerms(userId)
  }

  followSignedInUser()
  const stopFollowingAuth = useAuthStore.subscribe(followSignedInUser)
  const stopFollowingTerms = onUserTermsChange(() => void uploadTerms())

  return () => {
    stopFollowingAuth()
    stopFollowingTerms()
  }
}
