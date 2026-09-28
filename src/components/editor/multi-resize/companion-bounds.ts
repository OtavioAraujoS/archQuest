import {
  GROUP_MIN_DIMENSIONS,
  getParticipantResizeConstraints,
  SUB_PROCESS_MIN_DIMENSIONS,
  TEXT_ANNOTATION_MIN_DIMENSIONS,
} from 'bpmn-js/lib/features/modeling/behavior/ResizeBehavior'
import {
  ensureConstraints,
  resizeTRBL,
} from 'diagram-js/lib/features/resize/ResizeUtil'
import { asTRBL, roundBounds } from 'diagram-js/lib/layout/LayoutUtil'

import { isOfType } from '@/lib/bpmn/diagram-element-ancestry'

import type {
  Bounds,
  ResizableShape,
  ResizeDirection,
  ResizeService,
} from './multi-resize-services'

export interface EdgeDeltas {
  top: number
  right: number
  bottom: number
  left: number
}

export function measureEdgeDeltas(before: Bounds, after: Bounds): EdgeDeltas {
  return {
    top: after.y - before.y,
    left: after.x - before.x,
    right: after.x + after.width - (before.x + before.width),
    bottom: after.y + after.height - (before.y + before.height),
  }
}

function minimumDimensionsOf(shape: ResizableShape) {
  if (isOfType(shape, 'bpmn:SubProcess')) return SUB_PROCESS_MIN_DIMENSIONS
  if (isOfType(shape, 'bpmn:TextAnnotation')) {
    return TEXT_ANNOTATION_MIN_DIMENSIONS
  }
  if (isOfType(shape, 'bpmn:Group')) return GROUP_MIN_DIMENSIONS
  return undefined
}

function resizeConstraintsOf(
  shape: ResizableShape,
  direction: ResizeDirection,
  resize: ResizeService,
) {
  if (isOfType(shape, 'bpmn:Participant')) {
    return getParticipantResizeConstraints(shape as never, direction)
  }
  const minimumBox = resize.computeMinResizeBox({
    shape,
    direction,
    minDimensions: minimumDimensionsOf(shape),
  })
  return { min: asTRBL(minimumBox) }
}

export function planCompanionBounds(
  shape: ResizableShape,
  direction: ResizeDirection,
  edgeDeltas: EdgeDeltas,
  resize: ResizeService,
): Bounds {
  const stretchedBounds = resizeTRBL(shape, edgeDeltas)
  const constraints = resizeConstraintsOf(shape, direction, resize)
  return roundBounds(ensureConstraints(stretchedBounds, constraints))
}

export function haveBoundsChanged(shape: Bounds, bounds: Bounds) {
  return (
    shape.x !== bounds.x ||
    shape.y !== bounds.y ||
    shape.width !== bounds.width ||
    shape.height !== bounds.height
  )
}
