import { describe, expect, it } from 'vitest'

import {
  planElementSizes,
  sharedDimension,
} from '@/components/editor/element-menu/plan-element-sizes'
import {
  makeResizableShape,
  smallestResizeBox,
} from '../multi-resize/group-resize-fakes'

function makeTask(width: number, height: number) {
  return makeResizableShape('bpmn:Task', { x: 10, y: 20, width, height })
}

describe('plan element sizes', () => {
  it('reads a size shared by every selected shape', () => {
    const shapes = [makeTask(100, 80), makeTask(100, 60)]

    expect(sharedDimension(shapes, 'width')).toBe(100)
    expect(sharedDimension(shapes, 'height')).toBeUndefined()
  })

  it('resizes from the top-left corner, keeping the other dimension', () => {
    const task = makeTask(100, 80)

    expect(planElementSizes([task], { width: 160 }, smallestResizeBox)).toEqual(
      {
        resizes: [
          { shape: task, bounds: { x: 10, y: 20, width: 160, height: 80 } },
        ],
        wasLimitedByMinimum: false,
      },
    )
  })

  it('stops at the activity minimum and says so', () => {
    const plan = planElementSizes(
      [makeTask(100, 80)],
      { height: 10 },
      smallestResizeBox,
    )

    expect(plan.resizes[0].bounds.height).toBe(40)
    expect(plan.wasLimitedByMinimum).toBe(true)
  })

  it('skips shapes that already have the requested size', () => {
    expect(
      planElementSizes([makeTask(100, 80)], { width: 100 }, smallestResizeBox)
        .resizes,
    ).toEqual([])
  })
})
