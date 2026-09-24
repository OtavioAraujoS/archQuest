import { beforeEach, describe, expect, it } from 'vitest'

import { db } from '@/lib/db'
import {
  renameDiagram,
  saveDiagramContent,
  saveDiagramThumbnail,
} from '@/lib/diagrams/local-diagram-changes'
import { makeAccountDiagram, makeGuestDiagram } from './diagram-fixtures'

describe('local diagram changes', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
  })

  it('saves guest content without marking it for upload', async () => {
    await db.diagrams.add(makeGuestDiagram())

    await saveDiagramContent('guest-1', { bpmnXml: '<xml>new</xml>', thumbnail: '<svg>new</svg>' })

    const savedDiagram = await db.diagrams.get('guest-1')
    expect(savedDiagram).toMatchObject({
      bpmnXml: '<xml>new</xml>',
      thumbnail: '<svg>new</svg>',
      dirty: false,
    })
    expect(savedDiagram?.updatedAt).toBeGreaterThan(1)
  })

  it('marks an account diagram for upload when its content changes', async () => {
    await db.diagrams.add(makeAccountDiagram())

    await saveDiagramContent('account-1', { bpmnXml: '<xml>new</xml>', thumbnail: '<svg />' })

    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({ dirty: true, version: 3 })
  })

  it('marks an account diagram for upload when renamed', async () => {
    await db.diagrams.add(makeAccountDiagram())

    await renameDiagram('account-1', 'Novo nome')

    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({
      name: 'Novo nome',
      dirty: true,
    })
  })

  it('saves a thumbnail without changing the last edit time', async () => {
    await db.diagrams.add(makeAccountDiagram({ updatedAt: 42 }))

    await saveDiagramThumbnail('account-1', '<svg>thumb</svg>')

    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({
      thumbnail: '<svg>thumb</svg>',
      updatedAt: 42,
      dirty: true,
    })
  })

  it('ignores changes to a diagram that no longer exists', async () => {
    await renameDiagram('missing', 'Nada')

    await expect(db.diagrams.count()).resolves.toBe(0)
  })
})
