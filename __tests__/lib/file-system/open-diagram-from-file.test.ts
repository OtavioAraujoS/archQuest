import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { linkedFileOf, useLinkedFilesStore } from '@/lib/file-system/linked-files-store'
import { openDiagramFromFile } from '@/lib/file-system/open-diagram-from-file'
import { createFakeFileHandle } from './fake-file-handle'

const { openBpmnFile } = vi.hoisted(() => ({ openBpmnFile: vi.fn() }))

vi.mock('@/lib/file-system/bpmn-file-access', () => ({ openBpmnFile }))

describe('openDiagramFromFile', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    useLinkedFilesStore.setState({ fileHandlesByDiagramId: {} })
    openBpmnFile.mockReset()
  })

  it('creates a diagram from the file and links the two', async () => {
    const { handle } = createFakeFileHandle({ fileName: 'Compras.bpmn' })
    openBpmnFile.mockResolvedValue({ handle, diagramName: 'Compras', xml: '<xml>compras</xml>' })

    const diagramId = await openDiagramFromFile()

    expect(diagramId).not.toBeNull()
    await expect(db.diagrams.get(diagramId!)).resolves.toMatchObject({
      name: 'Compras',
      bpmnXml: '<xml>compras</xml>',
    })
    expect(linkedFileOf(diagramId!)).toBe(handle)
  })

  it('creates nothing when the picker is cancelled', async () => {
    openBpmnFile.mockResolvedValue(null)

    await expect(openDiagramFromFile()).resolves.toBeNull()
    await expect(db.diagrams.count()).resolves.toBe(0)
  })
})
