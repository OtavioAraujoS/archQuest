export function isFileSystemAccessSupported() {
  return (
    typeof window.showOpenFilePicker === 'function' &&
    typeof window.showSaveFilePicker === 'function'
  )
}
