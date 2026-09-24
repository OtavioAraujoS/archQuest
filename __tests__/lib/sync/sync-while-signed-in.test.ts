import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { startDiagramSyncWhileSignedIn } from '@/lib/sync/sync-while-signed-in'
import { OWNER_ID } from '../diagrams/diagram-fixtures'
import { signInAsDiagramOwner, signOutDiagramOwner } from '../diagrams/sign-in-as-owner'

const { startDiagramSync, stopDiagramSync } = vi.hoisted(() => {
  const stopDiagramSync = vi.fn()
  return { stopDiagramSync, startDiagramSync: vi.fn(() => stopDiagramSync) }
})

vi.mock('@/lib/sync/diagram-sync-runner', () => ({ startDiagramSync }))

describe('startDiagramSyncWhileSignedIn', () => {
  let stopFollowingSignIn = () => {}

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    stopFollowingSignIn()
    stopFollowingSignIn = () => {}
    signOutDiagramOwner()
  })

  it('does not sync while signed out', () => {
    stopFollowingSignIn = startDiagramSyncWhileSignedIn()

    expect(startDiagramSync).not.toHaveBeenCalled()
  })

  it('starts syncing the owner diagrams when already signed in', () => {
    signInAsDiagramOwner()

    stopFollowingSignIn = startDiagramSyncWhileSignedIn()

    expect(startDiagramSync).toHaveBeenCalledWith(OWNER_ID)
  })

  it('starts syncing once when the user signs in later', () => {
    stopFollowingSignIn = startDiagramSyncWhileSignedIn()

    signInAsDiagramOwner()
    signInAsDiagramOwner()

    expect(startDiagramSync).toHaveBeenCalledOnce()
  })

  it('stops syncing when the user signs out', () => {
    signInAsDiagramOwner()
    stopFollowingSignIn = startDiagramSyncWhileSignedIn()

    signOutDiagramOwner()

    expect(stopDiagramSync).toHaveBeenCalledOnce()
  })

  it('stops syncing when no longer followed', () => {
    signInAsDiagramOwner()

    startDiagramSyncWhileSignedIn()()

    expect(stopDiagramSync).toHaveBeenCalledOnce()
  })
})
