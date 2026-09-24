import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { keepLocalVersion, loadCloudVersion } from '@/lib/sync/resolve-conflict'
import { INITIAL_SYNC_STATE, useSyncStore } from '@/lib/sync/sync-store'
import { makeAccountDiagram, makeDiagramRow } from '../diagrams/diagram-fixtures'

const { fetchCloudDiagramRow } = vi.hoisted(() => ({ fetchCloudDiagramRow: vi.fn() }))

vi.mock('@/lib/diagrams/cloud-diagrams', () => ({ fetchCloudDiagramRow }))

const LOCAL_EDIT = makeAccountDiagram({
  version: 3,
  dirty: true,
  bpmnXml: '<xml>local edit</xml>',
})

describe('conflict resolution', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    await db.diagrams.add(LOCAL_EDIT)
    fetchCloudDiagramRow.mockReset().mockResolvedValue(
      makeDiagramRow({ version: 5, bpmn_xml: '<xml>other tab</xml>' }),
    )
    useSyncStore.setState({ ...INITIAL_SYNC_STATE, conflictedDiagramIds: ['account-1', 'other'] })
  })

  it('keeps the local copy and rebases it on the cloud version for the next upload', async () => {
    await keepLocalVersion('account-1')

    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({
      bpmnXml: '<xml>local edit</xml>',
      version: 5,
      dirty: true,
    })
    expect(useSyncStore.getState().conflictedDiagramIds).toEqual(['other'])
  })

  it('recreates the diagram in the cloud when it was deleted there', async () => {
    fetchCloudDiagramRow.mockResolvedValue(null)

    await keepLocalVersion('account-1')

    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({ version: 0, dirty: true })
  })

  it('replaces the local copy with the cloud version', async () => {
    await expect(loadCloudVersion('account-1')).resolves.toBe('loaded')

    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({
      bpmnXml: '<xml>other tab</xml>',
      version: 5,
      dirty: false,
    })
    expect(useSyncStore.getState().conflictedDiagramIds).toEqual(['other'])
  })

  it('removes the local copy when the diagram was deleted in the cloud', async () => {
    fetchCloudDiagramRow.mockResolvedValue(null)

    await expect(loadCloudVersion('account-1')).resolves.toBe('deleted-in-cloud')

    await expect(db.diagrams.get('account-1')).resolves.toBeUndefined()
  })

  it('keeps the conflict and the local copy when the cloud cannot be reached', async () => {
    fetchCloudDiagramRow.mockRejectedValue(new Error('offline'))

    await expect(loadCloudVersion('account-1')).rejects.toThrow('offline')
    await expect(keepLocalVersion('account-1')).rejects.toThrow('offline')

    await expect(db.diagrams.get('account-1')).resolves.toEqual(LOCAL_EDIT)
    expect(useSyncStore.getState().conflictedDiagramIds).toContain('account-1')
  })
})
