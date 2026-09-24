import { saveBpmnFileAs, writeBpmnFile } from '@/lib/file-system/bpmn-file-access'
import { linkDiagramToFile, linkedFileOf } from '@/lib/file-system/linked-files-store'

export type FileSaveOutcome = 'saved' | 'cancelled'

export async function saveDiagramToFile(
  diagramId: string,
  xml: string,
  diagramName: string,
): Promise<FileSaveOutcome> {
  const linkedFile = linkedFileOf(diagramId)
  if (linkedFile) {
    await writeBpmnFile(linkedFile, xml)
    return 'saved'
  }
  const chosenFile = await saveBpmnFileAs(xml, diagramName)
  if (!chosenFile) return 'cancelled'
  linkDiagramToFile(diagramId, chosenFile)
  return 'saved'
}
