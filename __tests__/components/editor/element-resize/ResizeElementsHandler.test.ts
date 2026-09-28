import { describe, expect, it, vi } from 'vitest'

import ResizeElementsHandler from '@/components/editor/element-resize/ResizeElementsHandler'
import { makeResizableShape } from '../multi-resize/group-resize-fakes'

describe('ResizeElementsHandler', () => {
  it('resizes every planned shape inside one command', () => {
    const modeling = { resizeShape: vi.fn() }
    const task = makeResizableShape('bpmn:Task', {
      x: 0,
      y: 0,
      width: 100,
      height: 80,
    })
    const bounds = { x: 0, y: 0, width: 150, height: 80 }

    new ResizeElementsHandler(modeling).preExecute({
      resizes: [{ shape: task, bounds }],
    })

    expect(modeling.resizeShape).toHaveBeenCalledWith(task, bounds)
  })
})
