import { beforeEach, describe, expect, it } from 'vitest'

import { db } from '@/lib/db'
import { moveGuestDiagramsToAccount } from '@/lib/diagrams/move-guest-diagrams-to-account'
import { makeAccountDiagram, makeGuestDiagram, OWNER_ID } from './diagram-fixtures'

describe('moveGuestDiagramsToAccount', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    await db.diagrams.bulkAdd([
      makeGuestDiagram({ id: 'guest-1' }),
      makeGuestDiagram({ id: 'guest-2' }),
    ])
  })

  it('moves the chosen guest diagrams into the account, waiting for upload', async () => {
    await moveGuestDiagramsToAccount(['guest-1'], OWNER_ID)

    await expect(db.diagrams.get('guest-1')).resolves.toMatchObject({
      ownerId: OWNER_ID,
      version: 0,
      dirty: true,
    })
  })

  it('leaves the diagrams not chosen as guest diagrams', async () => {
    await moveGuestDiagramsToAccount(['guest-1'], OWNER_ID)

    await expect(db.diagrams.get('guest-2')).resolves.toMatchObject({
      ownerId: null,
      dirty: false,
    })
  })

  it('keeps the content and dates of the moved diagrams', async () => {
    await moveGuestDiagramsToAccount(['guest-1'], OWNER_ID)

    await expect(db.diagrams.get('guest-1')).resolves.toMatchObject({
      name: 'Rascunho local',
      bpmnXml: '<xml>guest</xml>',
      createdAt: 1,
      updatedAt: 1,
    })
  })

  it('never takes over a diagram that already belongs to an account', async () => {
    await db.diagrams.add(makeAccountDiagram({ ownerId: 'someone-else', version: 7 }))

    await moveGuestDiagramsToAccount(['account-1', 'missing'], OWNER_ID)

    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({
      ownerId: 'someone-else',
      version: 7,
    })
  })
})
