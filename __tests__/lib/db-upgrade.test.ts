import Dexie from 'dexie'
import { afterEach, describe, expect, it } from 'vitest'

import { createArchQuestDatabase, type ArchQuestDatabase } from '@/lib/db'

const UPGRADE_TEST_DATABASE_NAME = 'archquest-upgrade-test'

async function seedVersionOneDatabase() {
  const versionOneDatabase = new Dexie(UPGRADE_TEST_DATABASE_NAME)
  versionOneDatabase.version(1).stores({ diagrams: 'id, name, updatedAt' })
  await versionOneDatabase.table('diagrams').bulkAdd([
    { id: 'legacy-1', name: 'Legado', bpmnXml: '<xml />', thumbnail: '<svg />', createdAt: 1, updatedAt: 2 },
    { id: 'legacy-2', name: 'Outro', bpmnXml: '<xml />', createdAt: 3, updatedAt: 4 },
  ])
  versionOneDatabase.close()
}

describe('Dexie v1 → v2 upgrade', () => {
  let upgradedDatabase: ArchQuestDatabase | undefined

  afterEach(async () => {
    await upgradedDatabase?.delete()
    upgradedDatabase = undefined
  })

  it('keeps every existing diagram and turns it into a guest diagram', async () => {
    await seedVersionOneDatabase()

    upgradedDatabase = createArchQuestDatabase(UPGRADE_TEST_DATABASE_NAME)
    await upgradedDatabase.open()

    await expect(upgradedDatabase.diagrams.get('legacy-1')).resolves.toEqual({
      id: 'legacy-1',
      name: 'Legado',
      bpmnXml: '<xml />',
      thumbnail: '<svg />',
      createdAt: 1,
      updatedAt: 2,
      ownerId: null,
      version: 0,
      publicSlug: null,
      dirty: false,
    })
    await expect(upgradedDatabase.diagrams.count()).resolves.toBe(2)
  })

  it('indexes diagrams by owner after the upgrade', async () => {
    await seedVersionOneDatabase()
    upgradedDatabase = createArchQuestDatabase(UPGRADE_TEST_DATABASE_NAME)
    await upgradedDatabase.open()

    await upgradedDatabase.diagrams.update('legacy-2', { ownerId: 'owner-1' })

    const ownedDiagrams = await upgradedDatabase.diagrams.where('ownerId').equals('owner-1').toArray()
    expect(ownedDiagrams.map((diagram) => diagram.id)).toEqual(['legacy-2'])
  })
})
