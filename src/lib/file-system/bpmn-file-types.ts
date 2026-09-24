export const BPMN_FILE_PICKER_ID = 'archquest-bpmn'

export const BPMN_FILE_TYPES: FilePickerAcceptType[] = [
  {
    description: 'Diagrama BPMN',
    accept: { 'application/xml': ['.bpmn', '.xml'] },
  },
]

const BPMN_FILE_EXTENSION = /\.(bpmn|xml)$/i

export function diagramNameFromFileName(fileName: string) {
  return fileName.replace(BPMN_FILE_EXTENSION, '').trim() || fileName
}

export function bpmnFileNameFor(diagramName: string) {
  return `${diagramName.trim() || 'diagrama'}.bpmn`
}
