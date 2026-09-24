import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { findDiagram } from '@/lib/diagrams/find-diagram'
import { makeDiagramRow, makeGuestDiagram } from './diagram-fixtures'
import { signInAsDiagramOwner, signOutDiagramOwner } from './sign-in-as-owner'

const { fetchCloudDiagramRow } = vi.hoisted(() => ({ fetchCloudDiagramRow: vi.fn() }))

vi.mock('@/lib/diagrams/cloud-diagrams', () => ({ fetchCloudDiagramRow }))

describe('findDiagram', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    fetchCloudDiagramRow.mockReset()
  })

  afterEach(signOutDiagramOwner)

  it('returns the cached diagram without asking the cloud', async () => {
    await db.diagrams.add(makeGuestDiagram())
    signInAsDiagramOwner()

    await expect(findDiagram('guest-1')).resolves.toMatchObject({ id: 'guest-1' })
    expect(fetchCloudDiagramRow).not.toHaveBeenCalled()
  })

  it('never asks the cloud when signed out', async () => {
    await expect(findDiagram('account-1')).resolves.toBeUndefined()
    expect(fetchCloudDiagramRow).not.toHaveBeenCalled()
  })

  it('fetches and caches an account diagram missing from this browser', async () => {
    signInAsDiagramOwner()
    fetchCloudDiagramRow.mockResolvedValue(makeDiagramRow())

    await expect(findDiagram('account-1')).resolves.toMatchObject({ name: 'Processo na nuvem' })
    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({ version: 4 })
  })

  it('returns nothing when the diagram is in neither place', async () => {
    signInAsDiagramOwner()
    fetchCloudDiagramRow.mockResolvedValue(null)

    await expect(findDiagram('unknown')).resolves.toBeUndefined()
    await expect(db.diagrams.count()).resolves.toBe(0)
  })
})
