import Viewer from 'bpmn-js/lib/Viewer'
import { useEffect, useRef, useState } from 'react'

import TextStyleRenderer from '@/components/editor/TextStyleRenderer'
import { useIsDarkTheme } from '@/components/editor/style/useIsDarkTheme'
import textStyleModdle from '@/components/editor/text-style-moddle.json'
import { readDiagramThemeColors } from '@/components/templates/read-diagram-theme-colors'

export function useTemplatePreviewViewer(bpmnXml: string) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDarkTheme = useIsDarkTheme()
  const [hasRenderFailed, setHasRenderFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const viewer = new Viewer({
      container,
      bpmnRenderer: readDiagramThemeColors(container),
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
  }, [bpmnXml, isDarkTheme])

  return { containerRef, hasRenderFailed }
}
