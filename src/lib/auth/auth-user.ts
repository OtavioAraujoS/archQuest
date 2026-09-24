import type { User } from '@supabase/supabase-js'

import type { AuthUser } from '@/lib/auth/auth-store'

const FALLBACK_DISPLAY_NAME = 'Minha conta'

function readMetadataText(user: User, key: string) {
  const value: unknown = user.user_metadata?.[key]
  return typeof value === 'string' && value.trim() ? value : null
}

export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? null,
    displayName:
      readMetadataText(user, 'user_name') ??
      readMetadataText(user, 'full_name') ??
      user.email ??
      FALLBACK_DISPLAY_NAME,
    avatarUrl: readMetadataText(user, 'avatar_url'),
  }
}
