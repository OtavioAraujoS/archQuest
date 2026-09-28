import { describe, expect, it } from 'vitest'

import {
  haveBoundsChanged,
  measureEdgeDeltas,
  planCompanionBounds,
} from '@/components/editor/multi-resize/companion-bounds'
import { makeResizableShape, smallestResizeBox } from './group-resize-fakes'

describe('companion bounds', () => {
  it('measures how far each edge of the dragged shape moved', () => {
    expect(
      measureEdgeDeltas(
        { x: 100, y: 100, width: 200, height: 100 },
        { x: 80, y: 100, width: 250, height: 130 },
      ),
    ).toEqual({ top: 0, left: -20, right: 30, bottom: 30 })
  })

  it('moves the same edges of a companion shape by the same amount', () => {
    const group = makeResizableShape('bpmn:Group', {
      x: 500,
      y: 50,
      width: 300,
      height: 200,
    })

    expect(
      planCompanionBounds(
        group,
        'se',
        { top: 0, left: 0, right: 40, bottom: 20 },
        smallestResizeBox,
      ),
    ).toEqual({ x: 500, y: 50, width: 340, height: 220 })
  })

  it('stops a companion at its own minimum size', () => {
    const annotation = makeResizableShape('bpmn:TextAnnotation', {
      x: 0,
      y: 0,
      width: 120,
      height: 40,
    })
    const minimumBox = {
      computeMinResizeBox: () => ({ x: 0, y: 0, width: 100, height: 40 }),
    }

    const bounds = planCompanionBounds(
      annotation,
      'e',
      { top: 0, left: 0, right: -60, bottom: 0 },
      minimumBox,
    )

    expect(bounds.width).toBe(100)
  })

  it('notices when bounds did not change', () => {
    const bounds = { x: 1, y: 2, width: 3, height: 4 }

    expect(haveBoundsChanged(bounds, { ...bounds })).toBe(false)
    expect(haveBoundsChanged(bounds, { ...bounds, width: 5 })).toBe(true)
  })
})
