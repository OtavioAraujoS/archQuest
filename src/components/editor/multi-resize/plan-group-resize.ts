import { roundBounds } from 'diagram-js/lib/layout/LayoutUtil'

import type { Bounds } from '@/types/geometry'
import type {
  GroupResizeContext,
  ResizableShape,
  ResizeService,
  RulesService,
} from '@/types/resize'

import {
  haveBoundsChanged,
  measureEdgeDeltas,
  planCompanionBounds,
} from './companion-bounds'

export function planGroupResize(
  context: GroupResizeContext,
  rules: RulesService,
  resize: ResizeService,
) {
  const companionBounds = new Map<ResizableShape, Bounds>()
  if (!context.newBounds) return companionBounds
  const edgeDeltas = measureEdgeDeltas(
    context.shape,
    roundBounds(context.newBounds),
  )
  context.companionShapes?.forEach((shape) => {
    const bounds = planCompanionBounds(
      shape,
      context.direction,
      edgeDeltas,
      resize,
    )
    const isAllowed = rules.allowed('shape.resize', {
      shape,
      newBounds: bounds,
      direction: context.direction,
    })
    if (isAllowed && haveBoundsChanged(shape, bounds)) {
      companionBounds.set(shape, bounds)
    }
  })
  return companionBounds
}
