import { beforeEach, describe, expect, it } from 'vitest'

import { db } from '@/lib/db'
import { moveGuestDiagramsToAccount } from '@/lib/diagrams/move-guest-diagrams-to-account'
import { makeGuestFolder } from '../folders/folder-fixtures'
import { makeGuestDiagram, OWNER_ID } from './diagram-fixtures'

describe('moveGuestDiagramsToAccount folders', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    await db.folders.clear()
    await db.folders.bulkAdd([
      makeGuestFolder({ id: 'used-folder' }),
      makeGuestFolder({ id: 'unused-folder' }),
    ])
    await db.diagrams.add(
      makeGuestDiagram({ id: 'guest-1', folderId: 'used-folder' }),
    )
  })

  it('brings along the folder the chosen diagram is in', async () => {
    await moveGuestDiagramsToAccount(['guest-1'], OWNER_ID)

    await expect(db.folders.get('used-folder')).resolves.toMatchObject({
      ownerId: OWNER_ID,
      dirty: true,
    })
    await expect(db.diagrams.get('guest-1')).resolves.toMatchObject({
      folderId: 'used-folder',
    })
  })

  it('leaves the folders no chosen diagram uses in this browser', async () => {
    await moveGuestDiagramsToAccount(['guest-1'], OWNER_ID)

    await expect(db.folders.get('unused-folder')).resolves.toMatchObject({
      ownerId: null,
    })
  })
})
