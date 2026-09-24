import {
  BPMN_FILE_PICKER_ID,
  BPMN_FILE_TYPES,
  bpmnFileNameFor,
  diagramNameFromFileName,
} from '@/lib/file-system/bpmn-file-types'

export interface OpenedBpmnFile {
  handle: FileSystemFileHandle
  diagramName: string
  xml: string
}

export class FileWritePermissionDeniedError extends Error {
  constructor() {
    super('Permissão para gravar no arquivo negada.')
    this.name = 'FileWritePermissionDeniedError'
  }
}

function isPickerCancellation(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

function requirePicker<Picker>(picker: Picker | undefined): Picker {
  if (!picker) throw new Error('Este navegador não permite abrir ou salvar arquivos direto.')
  return picker
}

export async function openBpmnFile(): Promise<OpenedBpmnFile | null> {
  const showOpenFilePicker = requirePicker(window.showOpenFilePicker)
  try {
    const [handle] = await showOpenFilePicker({ id: BPMN_FILE_PICKER_ID, types: BPMN_FILE_TYPES })
    const file = await handle.getFile()
    return { handle, diagramName: diagramNameFromFileName(file.name), xml: await file.text() }
  } catch (error) {
    if (isPickerCancellation(error)) return null
    throw error
  }
}

export async function writeBpmnFile(handle: FileSystemFileHandle, xml: string) {
  const readWrite = { mode: 'readwrite' } as const
  const currentPermission = (await handle.queryPermission?.(readWrite)) ?? 'granted'
  if (currentPermission !== 'granted') {
    const requestedPermission = await handle.requestPermission?.(readWrite)
    if (requestedPermission !== 'granted') throw new FileWritePermissionDeniedError()
  }
  const writable = await handle.createWritable()
  await writable.write(xml)
  await writable.close()
}

export async function saveBpmnFileAs(
  xml: string,
  diagramName: string,
): Promise<FileSystemFileHandle | null> {
  const showSaveFilePicker = requirePicker(window.showSaveFilePicker)
  try {
    const handle = await showSaveFilePicker({
      id: BPMN_FILE_PICKER_ID,
      types: BPMN_FILE_TYPES,
      suggestedName: bpmnFileNameFor(diagramName),
    })
    await writeBpmnFile(handle, xml)
    return handle
  } catch (error) {
    if (isPickerCancellation(error)) return null
    throw error
  }
}
