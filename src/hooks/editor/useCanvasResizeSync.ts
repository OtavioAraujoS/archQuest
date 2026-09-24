import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { useEffect, type RefObject } from 'react'

export function useCanvasResizeSync(
  containerRef: RefObject<HTMLElement | null>,
  modelerRef: RefObject<BpmnModeler | null>,
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof ResizeObserver === 'undefined') return

    const containerSizeObserver = new ResizeObserver(() => {
      modelerRef.current?.get<{ resized: () => void }>('canvas').resized()
    })
    containerSizeObserver.observe(container)
    return () => containerSizeObserver.disconnect()
  }, [containerRef, modelerRef])
}
