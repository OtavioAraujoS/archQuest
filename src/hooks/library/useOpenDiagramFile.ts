import { useState } from 'react'

import { openDiagramFromFile } from '@/lib/file-system/open-diagram-from-file'

export const FILE_OPEN_FAILED_MESSAGE =
  'Não foi possível abrir o arquivo. Confira se ele é um .bpmn válido.'

export function useOpenDiagramFile(openDiagram: (id: string) => void) {
  const [fileOpenError, setFileOpenError] = useState<string | null>(null)

  async function openFileAsDiagram() {
    setFileOpenError(null)
    try {
      const diagramId = await openDiagramFromFile()
      if (diagramId) openDiagram(diagramId)
    } catch {
      setFileOpenError(FILE_OPEN_FAILED_MESSAGE)
    }
  }

  return {
    openFileAsDiagram,
    fileOpenError,
    dismissFileOpenError: () => setFileOpenError(null),
  }
}
