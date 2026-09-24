import { describe, expect, it } from 'vitest'

import { toAuthUser } from '@/lib/auth/auth-user'
import { createGitHubUser } from './fake-supabase-auth'

describe('toAuthUser', () => {
  it('uses the GitHub user name and avatar', () => {
    expect(toAuthUser(createGitHubUser())).toEqual({
      id: 'user-1',
      email: 'dev@example.com',
      displayName: 'devhub',
      avatarUrl: 'https://avatars.example.com/devhub.png',
    })
  })

  it('falls back to the e-mail for a magic link user without profile data', () => {
    const magicLinkUser = createGitHubUser({ user_metadata: {} })

    expect(toAuthUser(magicLinkUser)).toMatchObject({
      displayName: 'dev@example.com',
      avatarUrl: null,
    })
  })

  it('ignores blank or non-text metadata', () => {
    const userWithOddMetadata = createGitHubUser({
      email: undefined,
      user_metadata: { user_name: '  ', full_name: 42, avatar_url: '' },
    })

    expect(toAuthUser(userWithOddMetadata)).toMatchObject({
      email: null,
      displayName: 'Minha conta',
      avatarUrl: null,
    })
  })
})
