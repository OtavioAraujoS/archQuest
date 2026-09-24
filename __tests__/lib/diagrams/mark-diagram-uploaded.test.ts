import { beforeEach, describe, expect, it } from 'vitest'

import { db } from '@/lib/db'
import { markDiagramUploaded } from '@/lib/diagrams/mark-diagram-uploaded'
import { makeAccountDiagram, makeDiagramRow } from './diagram-fixtures'

describe('markDiagramUploaded', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
  })

  it('clears the pending flag and stores the cloud version', async () => {
    const uploadedDiagram = makeAccountDiagram({ dirty: true, version: 3 })
    await db.diagrams.add(uploadedDiagram)

    await markDiagramUploaded(uploadedDiagram, makeDiagramRow({ version: 4 }))

    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({
      dirty: false,
      version: 4,
    })
  })

  it('keeps the diagram pending when it changed during the upload', async () => {
    const uploadedDiagram = makeAccountDiagram({ dirty: true, version: 3 })
    await db.diagrams.add({ ...uploadedDiagram, bpmnXml: '<xml>edited meanwhile</xml>' })

    await markDiagramUploaded(uploadedDiagram, makeDiagramRow({ version: 4 }))

    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({
      dirty: true,
      version: 4,
      bpmnXml: '<xml>edited meanwhile</xml>',
    })
  })

  it('stores the public slug the cloud already has', async () => {
    const uploadedDiagram = makeAccountDiagram({ dirty: true })
    await db.diagrams.add(uploadedDiagram)

    await markDiagramUploaded(
      uploadedDiagram,
      makeDiagramRow({ public_slug: 'slugPublicoComEntropia01' }),
    )

    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({
      publicSlug: 'slugPublicoComEntropia01',
    })
  })

  it('does nothing when the diagram was deleted during the upload', async () => {
    await markDiagramUploaded(makeAccountDiagram(), makeDiagramRow())

    await expect(db.diagrams.count()).resolves.toBe(0)
  })
})
