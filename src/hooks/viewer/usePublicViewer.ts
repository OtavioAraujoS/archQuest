import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer'
import { useEffect, useRef, useState } from 'react'

import TextStyleRenderer from '@/components/editor/TextStyleRenderer'
import textStyleModdle from '@/components/editor/text-style-moddle.json'
import { THEMED_DIAGRAM_RENDERER_COLORS } from '@/lib/diagram-colors'
import { downloadBpmnXml, exportPng, exportSvg } from '@/lib/export'
import type { PublicDiagram } from '@/lib/supabase/database-types'

const FALLBACK_FILE_NAME = 'diagrama'

export function usePublicViewer(diagram: PublicDiagram) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<NavigatedViewer | null>(null)
  const [hasRenderFailed, setHasRenderFailed] = useState(false)
  const fileName = diagram.name.trim() || FALLBACK_FILE_NAME

  useEffect(() => {
    if (!containerRef.current) return
    const viewer = new NavigatedViewer({
      container: containerRef.current,
      bpmnRenderer: THEMED_DIAGRAM_RENDERER_COLORS,
      moddleExtensions: { archquest: textStyleModdle },
      additionalModules: [
        {
          __init__: ['textStyleRenderer'],
          textStyleRenderer: ['type', TextStyleRenderer],
        },
      ],
    })
    viewerRef.current = viewer
    let isViewerDiscarded = false
    viewer
      .importXML(diagram.bpmn_xml)
      .then(() => {
        if (isViewerDiscarded) return
        viewer
          .get<{ zoom: (level: string) => void }>('canvas')
          .zoom('fit-viewport')
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
  }, [diagram.bpmn_xml])

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
