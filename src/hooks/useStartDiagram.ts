import { useNavigate } from 'react-router-dom'

import { createDiagram } from '@/lib/create-diagram'
import { editorPath } from '@/lib/routes'
import type { DiagramTemplate } from '@/templates'

export function useStartDiagram(folderId: string | null = null) {
  const navigate = useNavigate()

  async function startBlankDiagram() {
    navigate(editorPath(await createDiagram(undefined, undefined, folderId)))
  }

  async function startDiagramFromTemplate(template: DiagramTemplate) {
    navigate(
      editorPath(await createDiagram(template.name, template.xml, folderId)),
    )
  }

  return { startBlankDiagram, startDiagramFromTemplate }
}
