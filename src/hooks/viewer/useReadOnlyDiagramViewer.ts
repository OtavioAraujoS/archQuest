import type Viewer from 'bpmn-js/lib/Viewer'
import { useEffect, useRef, useState } from 'react'

import {
  ARCHQUEST_RENDERING_OPTIONS,
  textStyleRendererModule,
} from '@/lib/bpmn/archquest-rendering-options'
import { fitDiagramToViewport } from '@/lib/bpmn/fit-diagram-to-viewport'

type ViewerClass<DiagramViewer extends Viewer> = new (
  options: ConstructorParameters<typeof Viewer>[0],
) => DiagramViewer

export function useReadOnlyDiagramViewer<DiagramViewer extends Viewer>(
  ViewerType: ViewerClass<DiagramViewer>,
  bpmnXml: string,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<DiagramViewer | null>(null)
  const [hasRenderFailed, setHasRenderFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const viewer = new ViewerType({
      container,
      ...ARCHQUEST_RENDERING_OPTIONS,
      additionalModules: [textStyleRendererModule],
    })
    viewerRef.current = viewer
    let isViewerDiscarded = false
    viewer
      .importXML(bpmnXml)
      .then(() => {
        if (isViewerDiscarded) return
        fitDiagramToViewport(viewer)
        setHasRenderFailed(false)
      })
      .catch(() => {
        if (!isViewerDiscarded) setHasRenderFailed(true)
      })

    return () => {
      isViewerDiscarded = true
      viewer.destroy()
      viewerRef.current = null
    }
  }, [ViewerType, bpmnXml])

  return { containerRef, viewerRef, hasRenderFailed }
}
