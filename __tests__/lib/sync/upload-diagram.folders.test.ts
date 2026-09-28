import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { uploadDiagram } from '@/lib/sync/upload-diagram'
import {
  makeAccountDiagram,
  makeDiagramRow,
} from '../diagrams/diagram-fixtures'
import { makeAccountFolder, makeGuestFolder } from '../folders/folder-fixtures'

const { insertCloudDiagram } = vi.hoisted(() => ({
  insertCloudDiagram: vi.fn(),
}))

vi.mock('@/lib/diagrams/cloud-diagram-writes', () => ({
  insertCloudDiagram,
  updateCloudDiagramAtVersion: vi.fn(),
}))

async function uploadNewDiagramIn(folderId: string) {
  const diagram = makeAccountDiagram({ version: 0, dirty: true, folderId })
  await db.diagrams.add(diagram)
  await uploadDiagram(diagram)
}

describe('uploadDiagram folders', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    await db.folders.clear()
    insertCloudDiagram.mockReset().mockResolvedValue(makeDiagramRow())
  })

  it('sends the folder of the diagram when it belongs to the same account', async () => {
    await db.folders.add(makeAccountFolder())

    await uploadNewDiagramIn('account-folder')

    expect(insertCloudDiagram).toHaveBeenCalledWith(
      expect.objectContaining({ folder_id: 'account-folder' }),
    )
  })

  it('leaves the diagram outside any folder when the folder is gone', async () => {
    await uploadNewDiagramIn('deleted-folder')

    expect(insertCloudDiagram).toHaveBeenCalledWith(
      expect.objectContaining({ folder_id: null }),
    )
  })

  it('never points to a folder of another owner', async () => {
    await db.folders.add(makeGuestFolder())

    await uploadNewDiagramIn('guest-folder')

    expect(insertCloudDiagram).toHaveBeenCalledWith(
      expect.objectContaining({ folder_id: null }),
    )
  })
})
