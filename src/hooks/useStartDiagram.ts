import { useNavigate } from 'react-router-dom'

import { createDiagram } from '@/lib/create-diagram'
import { editorPath } from '@/lib/routes'
import type { DiagramTemplate } from '@/templates'

export function useStartDiagram() {
  const navigate = useNavigate()

  async function startBlankDiagram() {
    navigate(editorPath(await createDiagram()))
  }

  async function startDiagramFromTemplate(template: DiagramTemplate) {
    navigate(editorPath(await createDiagram(template.name, template.xml)))
  }

  return { startBlankDiagram, startDiagramFromTemplate }
}
