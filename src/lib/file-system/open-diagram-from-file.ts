import { createDiagram } from '@/lib/create-diagram'
import { openBpmnFile } from '@/lib/file-system/bpmn-file-access'
import { linkDiagramToFile } from '@/lib/file-system/linked-files-store'

export async function openDiagramFromFile(): Promise<string | null> {
  const openedFile = await openBpmnFile()
  if (!openedFile) return null
  const diagramId = await createDiagram(openedFile.diagramName, openedFile.xml)
  linkDiagramToFile(diagramId, openedFile.handle)
  return diagramId
}
