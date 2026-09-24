import { beforeEach, describe, expect, it } from 'vitest'

import { db, GUEST_SYNC_FIELDS, type DiagramRecord } from '@/lib/db'

function makeRecord(overrides: Partial<DiagramRecord> = {}): DiagramRecord {
  return {
    id: 'diagram-1',
    name: 'Test diagram',
    bpmnXml: '<xml />',
    createdAt: 1,
    updatedAt: 1,
    ...GUEST_SYNC_FIELDS,
    ...overrides,
  }
}

describe('db.diagrams', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
  })

  it('adds and retrieves a diagram by id', async () => {
    const record = makeRecord()
    await db.diagrams.add(record)

    await expect(db.diagrams.get(record.id)).resolves.toEqual(record)
  })

  it('lists diagrams ordered by updatedAt, most recent first', async () => {
    await db.diagrams.bulkAdd([
      makeRecord({ id: 'older', updatedAt: 1 }),
      makeRecord({ id: 'newer', updatedAt: 2 }),
    ])

    const list = await db.diagrams.orderBy('updatedAt').reverse().toArray()

    expect(list.map((diagram) => diagram.id)).toEqual(['newer', 'older'])
  })

  it('updates a diagram', async () => {
    const record = makeRecord()
    await db.diagrams.add(record)

    await db.diagrams.update(record.id, { name: 'Renamed', updatedAt: 999 })

    const updated = await db.diagrams.get(record.id)
    expect(updated?.name).toBe('Renamed')
    expect(updated?.updatedAt).toBe(999)
  })

  it('deletes a diagram', async () => {
    const record = makeRecord()
    await db.diagrams.add(record)

    await db.diagrams.delete(record.id)

    await expect(db.diagrams.get(record.id)).resolves.toBeUndefined()
  })
})
