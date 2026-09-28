import Viewer from 'bpmn-js/lib/Viewer'

import { useReadOnlyDiagramViewer } from '@/hooks/viewer/useReadOnlyDiagramViewer'

export function useTemplatePreviewViewer(bpmnXml: string) {
  const { containerRef, hasRenderFailed } = useReadOnlyDiagramViewer(
    Viewer,
    bpmnXml,
  )
  return { containerRef, hasRenderFailed }
}
