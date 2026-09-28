import { describe, expect, it, vi } from 'vitest'

import type { ResizableShape } from '@/components/editor/multi-resize/multi-resize-services'
import MultiSelectionResizeHandles from '@/components/editor/multi-resize/MultiSelectionResizeHandles'
import {
  allowEveryResize,
  createFakeEventBus,
  makeResizableShape,
} from './group-resize-fakes'

const BOUNDS = { x: 0, y: 0, width: 300, height: 150 }

function setupHandles(selectedShapes: ResizableShape[]) {
  const eventBus = createFakeEventBus()
  const resizeHandles = { addResizer: vi.fn(), removeResizers: vi.fn() }
  new MultiSelectionResizeHandles(
    eventBus,
    {
      get: () => selectedShapes,
      isSelected: (element) => selectedShapes.includes(element as never),
    },
    resizeHandles,
    allowEveryResize,
  )
  return { eventBus, resizeHandles }
}

function makeTwoPools() {
  return [
    makeResizableShape('bpmn:Participant', BOUNDS),
    makeResizableShape('bpmn:Participant', BOUNDS),
  ]
}

describe('MultiSelectionResizeHandles', () => {
  it('shows resize handles on every selected resizable shape', () => {
    const pools = makeTwoPools()
    const { eventBus, resizeHandles } = setupHandles(pools)

    eventBus.fire('selection.changed', {})

    expect(resizeHandles.addResizer.mock.calls).toEqual([
      [pools[0]],
      [pools[1]],
    ])
  })

  it('redraws the handles after a selected shape changes', () => {
    const pools = makeTwoPools()
    const { eventBus, resizeHandles } = setupHandles(pools)

    eventBus.fire('shape.changed', { element: pools[0] })

    expect(resizeHandles.removeResizers).toHaveBeenCalledOnce()
    expect(resizeHandles.addResizer).toHaveBeenCalledTimes(2)
  })

  it('leaves a single selection to the default handles', () => {
    const { eventBus, resizeHandles } = setupHandles([
      makeResizableShape('bpmn:Participant', BOUNDS),
    ])

    eventBus.fire('selection.changed', {})

    expect(resizeHandles.removeResizers).not.toHaveBeenCalled()
  })
})
