import Dexie, { type EntityTable } from 'dexie'

export interface DiagramRecord {
  id: string
  name: string
  bpmnXml: string
  thumbnail?: string
  createdAt: number
  updatedAt: number
  ownerId: string | null
  version: number
  publicSlug: string | null
  dirty: boolean
  folderId?: string | null
}

export interface FolderRecord {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  ownerId: string | null
  dirty: boolean
}

export type SyncFields = Pick<
  DiagramRecord,
  'ownerId' | 'version' | 'publicSlug' | 'dirty'
>

export const GUEST_SYNC_FIELDS: SyncFields = {
  ownerId: null,
  version: 0,
  publicSlug: null,
  dirty: false,
}

export type ArchQuestDatabase = Dexie & {
  diagrams: EntityTable<DiagramRecord, 'id'>
  folders: EntityTable<FolderRecord, 'id'>
}

export function createArchQuestDatabase(databaseName = 'archquest') {
  const database = new Dexie(databaseName) as ArchQuestDatabase

  database.version(1).stores({
    diagrams: 'id, name, updatedAt',
  })

  database
    .version(2)
    .stores({
      diagrams: 'id, name, updatedAt, ownerId',
    })
    .upgrade((transaction) =>
      transaction
        .table<DiagramRecord>('diagrams')
        .toCollection()
        .modify({ ...GUEST_SYNC_FIELDS }),
    )

  database.version(3).stores({
    diagrams: 'id, name, updatedAt, ownerId, folderId',
    folders: 'id, ownerId, name',
  })

  return database
}

export const db = createArchQuestDatabase()
