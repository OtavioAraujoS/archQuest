interface FilePickerAcceptType {
  description?: string
  accept: Record<string, string[]>
}

interface OpenFilePickerOptions {
  id?: string
  types?: FilePickerAcceptType[]
  excludeAcceptAllOption?: boolean
  multiple?: boolean
}

interface SaveFilePickerOptions {
  id?: string
  types?: FilePickerAcceptType[]
  excludeAcceptAllOption?: boolean
  suggestedName?: string
}

interface FileSystemHandlePermissionDescriptor {
  mode?: 'read' | 'readwrite'
}

interface FileSystemHandle {
  queryPermission?(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>
  requestPermission?(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>
}

interface Window {
  showOpenFilePicker?(options?: OpenFilePickerOptions): Promise<FileSystemFileHandle[]>
  showSaveFilePicker?(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>
}
