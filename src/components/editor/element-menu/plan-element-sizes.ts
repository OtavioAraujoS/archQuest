import {
  haveBoundsChanged,
  planCompanionBounds,
} from '@/components/editor/multi-resize/companion-bounds'
import type {
  ResizableShape,
  ResizeService,
} from '@/components/editor/multi-resize/multi-resize-services'
import type { PlannedResize } from '@/components/editor/element-resize/ResizeElementsHandler'

export interface RequestedSize {
  width?: number
  height?: number
}

export function sharedDimension(
  shapes: ResizableShape[],
  dimension: 'width' | 'height',
) {
  const firstValue = shapes[0]?.[dimension]
  return shapes.every((shape) => shape[dimension] === firstValue)
    ? firstValue
    : undefined
}

export function planElementSizes(
  shapes: ResizableShape[],
  requested: RequestedSize,
  resize: ResizeService,
) {
  const resizes: PlannedResize[] = []
  let wasLimitedByMinimum = false
  shapes.forEach((shape) => {
    const width = requested.width ?? shape.width
    const height = requested.height ?? shape.height
    const bounds = planCompanionBounds(
      shape,
      'se',
      {
        top: 0,
        left: 0,
        right: width - shape.width,
        bottom: height - shape.height,
      },
      resize,
    )
    if (bounds.width !== width || bounds.height !== height) {
      wasLimitedByMinimum = true
    }
    if (haveBoundsChanged(shape, bounds)) resizes.push({ shape, bounds })
  })
  return { resizes, wasLimitedByMinimum }
}
