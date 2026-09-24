import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  linkDiagramToFile,
  linkedFileOf,
  useLinkedFilesStore,
} from '@/lib/file-system/linked-files-store'
import { saveDiagramToFile } from '@/lib/file-system/save-diagram-to-file'
import { createFakeFileHandle } from './fake-file-handle'

const { writeBpmnFile, saveBpmnFileAs } = vi.hoisted(() => ({
  writeBpmnFile: vi.fn(),
  saveBpmnFileAs: vi.fn(),
}))

vi.mock('@/lib/file-system/bpmn-file-access', () => ({ writeBpmnFile, saveBpmnFileAs }))

describe('saveDiagramToFile', () => {
  beforeEach(() => {
    useLinkedFilesStore.setState({ fileHandlesByDiagramId: {} })
    writeBpmnFile.mockReset().mockResolvedValue(undefined)
    saveBpmnFileAs.mockReset()
  })

  it('writes straight to the linked file, without a dialog', async () => {
    const { handle } = createFakeFileHandle()
    linkDiagramToFile('purchase', handle)

    await expect(saveDiagramToFile('purchase', '<xml />', 'Compras')).resolves.toBe('saved')

    expect(writeBpmnFile).toHaveBeenCalledWith(handle, '<xml />')
    expect(saveBpmnFileAs).not.toHaveBeenCalled()
  })

  it('asks where to save when nothing is linked, then links the chosen file', async () => {
    const { handle } = createFakeFileHandle()
    saveBpmnFileAs.mockResolvedValue(handle)

    await expect(saveDiagramToFile('purchase', '<xml />', 'Compras')).resolves.toBe('saved')

    expect(saveBpmnFileAs).toHaveBeenCalledWith('<xml />', 'Compras')
    expect(linkedFileOf('purchase')).toBe(handle)
  })

  it('links nothing when the save dialog is cancelled', async () => {
    saveBpmnFileAs.mockResolvedValue(null)

    await expect(saveDiagramToFile('purchase', '<xml />', 'Compras')).resolves.toBe('cancelled')
    expect(linkedFileOf('purchase')).toBeUndefined()
  })
})
