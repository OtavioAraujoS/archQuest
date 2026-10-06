import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { INITIAL_AUTH_STATE, useAuthStore } from '@/lib/auth/auth-store'
import {
  acceptTerm,
  replaceUserTerms,
  userAcceptedTerms,
} from '@/lib/spelling/accepted-terms'
import {
  ACCEPTED_TERMS_METADATA_KEY,
  startAcceptedTermsSyncWhileSignedIn,
} from '@/lib/spelling/sync-accepted-terms'

const auth = vi.hoisted(() => ({
  getUser: vi.fn(),
  updateUser: vi.fn(async () => ({ error: null })),
}))

vi.mock('@/lib/supabase/require-supabase-client', () => ({
  requireSupabaseClient: async () => ({ auth }),
}))

function accountWithTerms(terms?: string[]) {
  const user_metadata = terms ? { [ACCEPTED_TERMS_METADATA_KEY]: terms } : {}
  auth.getUser.mockResolvedValue({
    data: { user: { id: 'user-1', user_metadata } },
    error: null,
  })
}

function signIn() {
  useAuthStore.setState({
    status: 'signed-in',
    user: { id: 'user-1', email: null, displayName: 'Dev', avatarUrl: null },
  })
}

describe('startAcceptedTermsSyncWhileSignedIn', () => {
  let stopSync = () => {}

  beforeEach(() => {
    vi.clearAllMocks()
    replaceUserTerms([])
  })

  afterEach(() => {
    stopSync()
    useAuthStore.setState(INITIAL_AUTH_STATE)
  })

  it('adopts the dictionary saved in the account', async () => {
    accountWithTerms(['kafka'])
    replaceUserTerms(['stale'])

    stopSync = startAcceptedTermsSyncWhileSignedIn()
    signIn()

    await vi.waitFor(() => expect(userAcceptedTerms()).toEqual(['kafka']))
    expect(auth.updateUser).not.toHaveBeenCalled()
  })

  it('uploads the local dictionary to an account that has none', async () => {
    accountWithTerms()
    replaceUserTerms(['kafka'])

    stopSync = startAcceptedTermsSyncWhileSignedIn()
    signIn()

    await vi.waitFor(() =>
      expect(auth.updateUser).toHaveBeenCalledWith({
        data: { [ACCEPTED_TERMS_METADATA_KEY]: ['kafka'] },
      }),
    )
  })

  it('saves words accepted while signed in, and none while signed out', async () => {
    acceptTerm('offline')
    accountWithTerms([])
    stopSync = startAcceptedTermsSyncWhileSignedIn()
    expect(auth.updateUser).not.toHaveBeenCalled()

    signIn()
    await vi.waitFor(() => expect(userAcceptedTerms()).toEqual([]))
    acceptTerm('Kafka')

    await vi.waitFor(() =>
      expect(auth.updateUser).toHaveBeenCalledWith({
        data: { [ACCEPTED_TERMS_METADATA_KEY]: ['kafka'] },
      }),
    )
  })
})
