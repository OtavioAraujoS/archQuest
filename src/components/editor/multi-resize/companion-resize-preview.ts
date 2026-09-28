import { attr as svgAttr, remove as svgRemove } from 'tiny-svg'

import type {
  Bounds,
  GroupResizeContext,
  PreviewSupportService,
  ResizeCanvasService,
} from './multi-resize-services'

const RESIZING_MARKER = 'djs-resizing'

function placeFrame(frame: SVGElement, { x, y, width, height }: Bounds) {
  svgAttr(frame, { x, y, width, height })
}

export function drawCompanionFrames(
  context: GroupResizeContext,
  previewSupport: PreviewSupportService,
  canvas: ResizeCanvasService,
) {
  const frames = (context.companionFrames ??= new Map())
  context.companionShapes?.forEach((shape) => {
    const bounds = context.companionBounds?.get(shape)
    let frame = frames.get(shape)
    if (!bounds) {
      if (frame) placeFrame(frame, shape)
      return
    }
    if (!frame) {
      frame = previewSupport.addFrame(shape, canvas.getActiveLayer())
      frames.set(shape, frame)
      canvas.addMarker(shape, RESIZING_MARKER)
    }
    placeFrame(frame, bounds)
  })
}

export function removeCompanionFrames(
  context: GroupResizeContext,
  canvas: ResizeCanvasService,
) {
  context.companionFrames?.forEach((frame, shape) => {
    svgRemove(frame)
    canvas.removeMarker(shape, RESIZING_MARKER)
  })
  context.companionFrames?.clear()
}
