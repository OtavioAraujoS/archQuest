import { describe, expect, it } from 'vitest'

import { describeCloudSyncStatus } from '@/lib/sync/cloud-sync-status'
import { INITIAL_SYNC_STATE, type SyncState } from '@/lib/sync/sync-store'
import { makeAccountDiagram, makeGuestDiagram } from '../diagrams/diagram-fixtures'

function syncState(overrides: Partial<SyncState> = {}): SyncState {
  return { ...INITIAL_SYNC_STATE, ...overrides }
}

describe('describeCloudSyncStatus', () => {
  it('shows nothing for a guest diagram or before the diagram loads', () => {
    expect(describeCloudSyncStatus(makeGuestDiagram(), syncState())).toBeNull()
    expect(describeCloudSyncStatus(undefined, syncState())).toBeNull()
  })

  it('is saved when the account diagram has no pending changes', () => {
    expect(describeCloudSyncStatus(makeAccountDiagram(), syncState())).toMatchObject({
      tone: 'saved',
      label: 'Salvo na nuvem',
    })
  })

  it('is saving while pending changes wait for upload online', () => {
    const pendingDiagram = makeAccountDiagram({ dirty: true })

    expect(describeCloudSyncStatus(pendingDiagram, syncState())).toMatchObject({
      tone: 'saving',
      label: 'Salvando…',
    })
  })

  it('is offline with pending changes when the network is down', () => {
    const pendingDiagram = makeAccountDiagram({ dirty: true })

    expect(
      describeCloudSyncStatus(pendingDiagram, syncState({ isOnline: false })),
    ).toMatchObject({ tone: 'warning', label: 'Offline — alterações pendentes' })
  })

  it('stays saved offline when nothing is pending', () => {
    expect(
      describeCloudSyncStatus(makeAccountDiagram(), syncState({ isOnline: false })),
    ).toMatchObject({ tone: 'saved' })
  })

  it('warns about a failed upload until the retry starts', () => {
    const pendingDiagram = makeAccountDiagram({ dirty: true })

    expect(
      describeCloudSyncStatus(pendingDiagram, syncState({ lastUploadFailed: true })),
    ).toMatchObject({ tone: 'warning', label: 'Erro ao salvar — tentando de novo' })
    expect(
      describeCloudSyncStatus(
        pendingDiagram,
        syncState({ lastUploadFailed: true, isUploading: true }),
      ),
    ).toMatchObject({ tone: 'saving' })
  })

  it('explains that a diagram above 2 MB stays out of the cloud', () => {
    const hugeDiagram = makeAccountDiagram({ dirty: true })

    const status = describeCloudSyncStatus(
      hugeDiagram,
      syncState({ tooLargeDiagramIds: [hugeDiagram.id] }),
    )

    expect(status).toMatchObject({ tone: 'error', label: 'Grande demais para a nuvem' })
    expect(status?.detail).toContain('2 MB')
  })

  it('reports a version conflict', () => {
    const conflictedDiagram = makeAccountDiagram({ dirty: true })

    expect(
      describeCloudSyncStatus(
        conflictedDiagram,
        syncState({ conflictedDiagramIds: [conflictedDiagram.id] }),
      ),
    ).toMatchObject({ tone: 'error', label: 'Conflito com a nuvem' })
  })
})
