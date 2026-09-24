import { beforeEach, describe, expect, it } from 'vitest'

import { db } from '@/lib/db'
import { forgetAccountDiagrams } from '@/lib/diagrams/forget-account-diagrams'
import { makeAccountDiagram, makeGuestDiagram } from './diagram-fixtures'

describe('forgetAccountDiagrams', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
  })

  it('removes every account diagram from this browser, including pending ones', async () => {
    await db.diagrams.bulkAdd([
      makeAccountDiagram({ id: 'saved' }),
      makeAccountDiagram({ id: 'pending', dirty: true }),
      makeAccountDiagram({ id: 'other-account', ownerId: 'someone-else' }),
    ])

    await forgetAccountDiagrams()

    await expect(db.diagrams.count()).resolves.toBe(0)
  })

  it('keeps the guest diagrams', async () => {
    await db.diagrams.bulkAdd([makeAccountDiagram(), makeGuestDiagram()])

    await forgetAccountDiagrams()

    const remainingDiagrams = await db.diagrams.toArray()
    expect(remainingDiagrams.map((diagram) => diagram.id)).toEqual(['guest-1'])
  })
})
