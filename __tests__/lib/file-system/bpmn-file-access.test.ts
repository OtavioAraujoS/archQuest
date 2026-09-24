import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  FileWritePermissionDeniedError,
  openBpmnFile,
  saveBpmnFileAs,
  writeBpmnFile,
} from '@/lib/file-system/bpmn-file-access'
import { createFakeFileHandle, installFilePickers, pickerCancellation } from './fake-file-handle'

describe('BPMN file access', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('opens a .bpmn file with its content, name and handle', async () => {
    const { handle } = createFakeFileHandle({ fileName: 'Compras.bpmn', content: '<xml>compras</xml>' })
    const showOpenFilePicker = vi.fn(async () => [handle])
    installFilePickers({ showOpenFilePicker, showSaveFilePicker: vi.fn() })

    await expect(openBpmnFile()).resolves.toEqual({
      handle,
      diagramName: 'Compras',
      xml: '<xml>compras</xml>',
    })
    expect(showOpenFilePicker).toHaveBeenCalledWith(
      expect.objectContaining({ types: [expect.objectContaining({ description: 'Diagrama BPMN' })] }),
    )
  })

  it('treats a cancelled open picker as nothing chosen, without an error', async () => {
    installFilePickers({ showOpenFilePicker: vi.fn(async () => Promise.reject(pickerCancellation())) })

    await expect(openBpmnFile()).resolves.toBeNull()
  })

  it('lets other open errors through', async () => {
    const securityError = new DOMException('Not allowed', 'SecurityError')
    installFilePickers({ showOpenFilePicker: vi.fn(async () => Promise.reject(securityError)) })

    await expect(openBpmnFile()).rejects.toBe(securityError)
  })

  it('saves as a new file named after the diagram and returns its handle', async () => {
    const { handle, writtenContents } = createFakeFileHandle()
    const showSaveFilePicker = vi.fn(async () => handle)
    installFilePickers({ showSaveFilePicker })

    await expect(saveBpmnFileAs('<xml>novo</xml>', 'Onboarding')).resolves.toBe(handle)
    expect(showSaveFilePicker).toHaveBeenCalledWith(
      expect.objectContaining({ suggestedName: 'Onboarding.bpmn' }),
    )
    expect(writtenContents).toEqual(['<xml>novo</xml>'])
  })

  it('treats a cancelled save picker as nothing saved, without an error', async () => {
    installFilePickers({ showSaveFilePicker: vi.fn(async () => Promise.reject(pickerCancellation())) })

    await expect(saveBpmnFileAs('<xml />', 'Onboarding')).resolves.toBeNull()
  })

  it('refuses to open or save when the browser has no file pickers', async () => {
    installFilePickers({})

    await expect(openBpmnFile()).rejects.toThrow('não permite abrir ou salvar arquivos')
    await expect(saveBpmnFileAs('<xml />', 'x')).rejects.toThrow('não permite abrir ou salvar arquivos')
  })

  it('writes over an existing file without asking when writing is already allowed', async () => {
    const { handle, fakeHandle, writtenContents } = createFakeFileHandle()

    await writeBpmnFile(handle, '<xml>atualizado</xml>')

    expect(writtenContents).toEqual(['<xml>atualizado</xml>'])
    expect(fakeHandle.requestPermission).not.toHaveBeenCalled()
  })

  it('asks for write permission on a file that was only opened', async () => {
    const { handle, fakeHandle, writtenContents } = createFakeFileHandle({ currentPermission: 'prompt' })

    await writeBpmnFile(handle, '<xml>atualizado</xml>')

    expect(fakeHandle.requestPermission).toHaveBeenCalledWith({ mode: 'readwrite' })
    expect(writtenContents).toEqual(['<xml>atualizado</xml>'])
  })

  it('writes nothing when write permission is denied', async () => {
    const { handle, writtenContents } = createFakeFileHandle({
      currentPermission: 'prompt',
      permissionAfterRequest: 'denied',
    })

    await expect(writeBpmnFile(handle, '<xml />')).rejects.toBeInstanceOf(
      FileWritePermissionDeniedError,
    )
    expect(writtenContents).toEqual([])
  })
})
