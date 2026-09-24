import { vi } from 'vitest'

interface FakeFileHandleOptions {
  fileName?: string
  content?: string
  currentPermission?: PermissionState
  permissionAfterRequest?: PermissionState
}

export function createFakeFileHandle({
  fileName = 'Compras.bpmn',
  content = '<bpmn:definitions />',
  currentPermission = 'granted',
  permissionAfterRequest = 'granted',
}: FakeFileHandleOptions = {}) {
  const writtenContents: string[] = []
  const handle = {
    kind: 'file',
    name: fileName,
    getFile: vi.fn(async () => new File([content], fileName)),
    createWritable: vi.fn(async () => {
      let pendingContent = ''
      return {
        write: vi.fn(async (chunk: string) => {
          pendingContent += chunk
        }),
        close: vi.fn(async () => {
          writtenContents.push(pendingContent)
        }),
      }
    }),
    queryPermission: vi.fn(async () => currentPermission),
    requestPermission: vi.fn(async () => permissionAfterRequest),
  }
  return { handle: handle as unknown as FileSystemFileHandle, fakeHandle: handle, writtenContents }
}

export function pickerCancellation() {
  return new DOMException('The user aborted a request.', 'AbortError')
}

export function installFilePickers(pickers: {
  showOpenFilePicker?: (...args: unknown[]) => Promise<unknown>
  showSaveFilePicker?: (...args: unknown[]) => Promise<unknown>
}) {
  vi.stubGlobal('showOpenFilePicker', pickers.showOpenFilePicker)
  vi.stubGlobal('showSaveFilePicker', pickers.showSaveFilePicker)
}
