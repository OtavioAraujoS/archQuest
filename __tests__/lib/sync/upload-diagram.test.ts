import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { CLOUD_MAX_TEXT_BYTES } from '@/lib/sync/cloud-size-limit'
import { uploadDiagram } from '@/lib/sync/upload-diagram'
import { makeAccountDiagram, makeDiagramRow } from '../diagrams/diagram-fixtures'

const { insertCloudDiagram, updateCloudDiagramAtVersion } = vi.hoisted(() => ({
  insertCloudDiagram: vi.fn(),
  updateCloudDiagramAtVersion: vi.fn(),
}))

vi.mock('@/lib/diagrams/cloud-diagram-writes', () => ({
  insertCloudDiagram,
  updateCloudDiagramAtVersion,
}))

const OVERSIZED_TEXT = 'x'.repeat(CLOUD_MAX_TEXT_BYTES + 1)

describe('uploadDiagram', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    vi.clearAllMocks()
    insertCloudDiagram.mockResolvedValue(makeDiagramRow({ version: 1 }))
    updateCloudDiagramAtVersion.mockResolvedValue(makeDiagramRow({ version: 4 }))
  })

  it('inserts a diagram never uploaded, keeping its id and dates', async () => {
    const newDiagram = makeAccountDiagram({ version: 0, dirty: true, createdAt: 0, updatedAt: 1000 })
    await db.diagrams.add(newDiagram)

    await expect(uploadDiagram(newDiagram)).resolves.toBe('uploaded')

    expect(insertCloudDiagram).toHaveBeenCalledWith({
      id: 'account-1',
      name: 'Processo na conta',
      bpmn_xml: '<xml>account</xml>',
      thumbnail: null,
      created_at: '1970-01-01T00:00:00.000Z',
      updated_at: '1970-01-01T00:00:01.000Z',
    })
    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({ version: 1, dirty: false })
  })

  it('updates an uploaded diagram only at the version it was based on', async () => {
    const editedDiagram = makeAccountDiagram({ version: 3, dirty: true, thumbnail: '<svg />' })
    await db.diagrams.add(editedDiagram)

    await expect(uploadDiagram(editedDiagram)).resolves.toBe('uploaded')

    expect(updateCloudDiagramAtVersion).toHaveBeenCalledWith('account-1', 3, {
      name: 'Processo na conta',
      bpmn_xml: '<xml>account</xml>',
      thumbnail: '<svg />',
    })
    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({ version: 4, dirty: false })
  })

  it('reports a conflict when the cloud has another version', async () => {
    const staleDiagram = makeAccountDiagram({ version: 3, dirty: true })
    await db.diagrams.add(staleDiagram)
    updateCloudDiagramAtVersion.mockResolvedValue(null)

    await expect(uploadDiagram(staleDiagram)).resolves.toBe('conflict')
    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({ version: 3, dirty: true })
  })

  it('refuses XML above 2 MB without calling the cloud', async () => {
    const hugeDiagram = makeAccountDiagram({ dirty: true, bpmnXml: OVERSIZED_TEXT })

    await expect(uploadDiagram(hugeDiagram)).resolves.toBe('too-large')
    expect(updateCloudDiagramAtVersion).not.toHaveBeenCalled()
  })

  it('uploads without the thumbnail when only the thumbnail is too large', async () => {
    const diagramWithHugeThumbnail = makeAccountDiagram({ dirty: true, thumbnail: OVERSIZED_TEXT })
    await db.diagrams.add(diagramWithHugeThumbnail)

    await uploadDiagram(diagramWithHugeThumbnail)

    expect(updateCloudDiagramAtVersion).toHaveBeenCalledWith(
      'account-1',
      3,
      expect.objectContaining({ thumbnail: null }),
    )
  })

  it('lets network errors reach the caller for a retry', async () => {
    const editedDiagram = makeAccountDiagram({ dirty: true })
    updateCloudDiagramAtVersion.mockRejectedValue(new Error('Failed to fetch'))

    await expect(uploadDiagram(editedDiagram)).rejects.toThrow('Failed to fetch')
  })
})
