import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { pullAccountDiagrams } from '@/lib/diagrams/pull-account-diagrams'
import {
  makeAccountDiagram,
  makeDiagramRow,
  makeGuestDiagram,
  OWNER_ID,
} from './diagram-fixtures'

const { fetchAccountDiagramRows } = vi.hoisted(() => ({ fetchAccountDiagramRows: vi.fn() }))

vi.mock('@/lib/diagrams/cloud-diagrams', () => ({ fetchAccountDiagramRows }))

describe('pullAccountDiagrams', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    fetchAccountDiagramRows.mockReset()
  })

  it('caches the account diagrams from the cloud as clean records', async () => {
    fetchAccountDiagramRows.mockResolvedValue([makeDiagramRow()])

    await pullAccountDiagrams(OWNER_ID)

    await expect(db.diagrams.get('account-1')).resolves.toEqual({
      id: 'account-1',
      name: 'Processo na nuvem',
      bpmnXml: '<xml>cloud</xml>',
      thumbnail: '<svg>cloud</svg>',
      createdAt: Date.parse('2026-09-20T10:00:00.000Z'),
      updatedAt: Date.parse('2026-09-24T10:00:00.000Z'),
      ownerId: OWNER_ID,
      version: 4,
      publicSlug: null,
      dirty: false,
    })
  })

  it('refreshes a clean cached copy with the cloud version', async () => {
    await db.diagrams.add(makeAccountDiagram({ dirty: false }))
    fetchAccountDiagramRows.mockResolvedValue([makeDiagramRow()])

    await pullAccountDiagrams(OWNER_ID)

    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({
      name: 'Processo na nuvem',
      version: 4,
    })
  })

  it('keeps a cached copy with local changes not uploaded yet', async () => {
    await db.diagrams.add(makeAccountDiagram({ dirty: true }))
    fetchAccountDiagramRows.mockResolvedValue([makeDiagramRow()])

    await pullAccountDiagrams(OWNER_ID)

    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({
      name: 'Processo na conta',
      version: 3,
      dirty: true,
    })
  })

  it('removes a clean cached diagram that was deleted on another device', async () => {
    await db.diagrams.add(makeAccountDiagram({ dirty: false }))
    fetchAccountDiagramRows.mockResolvedValue([])

    await pullAccountDiagrams(OWNER_ID)

    await expect(db.diagrams.get('account-1')).resolves.toBeUndefined()
  })

  it('keeps a diagram created offline that was never uploaded', async () => {
    await db.diagrams.add(makeAccountDiagram({ id: 'new-offline', version: 0, dirty: true }))
    fetchAccountDiagramRows.mockResolvedValue([])

    await pullAccountDiagrams(OWNER_ID)

    await expect(db.diagrams.get('new-offline')).resolves.toBeDefined()
  })

  it('never touches guest diagrams', async () => {
    await db.diagrams.add(makeGuestDiagram())
    fetchAccountDiagramRows.mockResolvedValue([])

    await pullAccountDiagrams(OWNER_ID)

    await expect(db.diagrams.get('guest-1')).resolves.toEqual(makeGuestDiagram())
  })

  it('leaves the cache untouched when the cloud cannot be reached', async () => {
    await db.diagrams.add(makeAccountDiagram({ dirty: false }))
    fetchAccountDiagramRows.mockRejectedValue(new Error('offline'))

    await expect(pullAccountDiagrams(OWNER_ID)).rejects.toThrow('offline')
    await expect(db.diagrams.get('account-1')).resolves.toBeDefined()
  })
})
