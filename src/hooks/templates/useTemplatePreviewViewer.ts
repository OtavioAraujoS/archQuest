import Viewer from 'bpmn-js/lib/Viewer'
import { useEffect, useRef, useState } from 'react'

import TextStyleRenderer from '@/components/editor/TextStyleRenderer'
import textStyleModdle from '@/components/editor/text-style-moddle.json'
import { THEMED_DIAGRAM_RENDERER_COLORS } from '@/lib/diagram-colors'

export function useTemplatePreviewViewer(bpmnXml: string) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasRenderFailed, setHasRenderFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const viewer = new Viewer({
      container,
      bpmnRenderer: THEMED_DIAGRAM_RENDERER_COLORS,
      moddleExtensions: { archquest: textStyleModdle },
      additionalModules: [
        {
          __init__: ['textStyleRenderer'],
          textStyleRenderer: ['type', TextStyleRenderer],
        },
      ],
    })
    let isViewerDiscarded = false
    viewer
      .importXML(bpmnXml)
      .then(() => {
        if (isViewerDiscarded) return
        viewer
          .get<{ zoom: (level: string, center: string) => void }>('canvas')
          .zoom('fit-viewport', 'auto')
        setHasRenderFailed(false)
      })
      .catch(() => {
        if (!isViewerDiscarded) setHasRenderFailed(true)
      })

    return () => {
      isViewerDiscarded = true
      viewer.destroy()
    }
  }, [bpmnXml])

  return { containerRef, hasRenderFailed }
}
