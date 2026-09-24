import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer'

import { useReadOnlyDiagramViewer } from '@/hooks/viewer/useReadOnlyDiagramViewer'
import { downloadBpmnXml, exportPng, exportSvg } from '@/lib/export'
import type { PublicDiagram } from '@/lib/supabase/database-types'

const FALLBACK_FILE_NAME = 'diagrama'

export function usePublicViewer(diagram: PublicDiagram) {
  const { containerRef, viewerRef, hasRenderFailed } = useReadOnlyDiagramViewer(
    NavigatedViewer,
    diagram.bpmn_xml,
  )
  const fileName = diagram.name.trim() || FALLBACK_FILE_NAME

  function downloadBpmn() {
    downloadBpmnXml(diagram.bpmn_xml, fileName)
  }

  async function downloadSvg() {
    if (viewerRef.current) await exportSvg(viewerRef.current, fileName)
  }

  async function downloadPng() {
    if (viewerRef.current) await exportPng(viewerRef.current, fileName)
  }

  return {
    containerRef,
    hasRenderFailed,
    downloadBpmn,
    downloadSvg,
    downloadPng,
  }
}
