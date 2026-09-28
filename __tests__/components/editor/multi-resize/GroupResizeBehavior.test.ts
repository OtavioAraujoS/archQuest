import { describe, expect, it, vi } from 'vitest'

import GroupResizeBehavior from '@/components/editor/multi-resize/GroupResizeBehavior'
import {
  allowEveryResize,
  createFakeEventBus,
  createSvgElement,
  makeResizableShape,
  smallestResizeBox,
} from './group-resize-fakes'

const WIDER_BOUNDS = { x: 0, y: 0, width: 360, height: 150 }

function setupGroupResize() {
  const eventBus = createFakeEventBus()
  const draggedShape = makeResizableShape('bpmn:Group', {
    x: 0,
    y: 0,
    width: 300,
    height: 150,
  })
  const companionShape = makeResizableShape('bpmn:Group', {
    x: 0,
    y: 200,
    width: 300,
    height: 150,
  })
  const modeling = { resizeShape: vi.fn() }
  const canvas = {
    getActiveLayer: () => createSvgElement('g'),
    addMarker: vi.fn(),
    removeMarker: vi.fn(),
  }
  new GroupResizeBehavior(
    eventBus,
    { get: () => [draggedShape, companionShape], isSelected: () => true },
    allowEveryResize,
    smallestResizeBox,
    modeling,
    { addFrame: () => createSvgElement('rect') },
    canvas,
  )
  const context = {
    shape: draggedShape,
    direction: 'e' as const,
    canExecute: true as unknown,
    newBounds: WIDER_BOUNDS,
  }
  return { eventBus, draggedShape, companionShape, modeling, canvas, context }
}

function dragAndDrop(setup: ReturnType<typeof setupGroupResize>) {
  const { eventBus, context, draggedShape } = setup
  eventBus.fire('resize.start', { context })
  eventBus.fire('resize.move', { context })
  eventBus.fire('resize.end', { context })
  eventBus.fire('commandStack.shape.resize.postExecuted', {
    context: { shape: draggedShape },
  })
  eventBus.fire('resize.cleanup', { context })
}

describe('GroupResizeBehavior', () => {
  it('resizes the other selected shapes together with the dragged one', () => {
    const setup = setupGroupResize()

    dragAndDrop(setup)

    expect(setup.modeling.resizeShape).toHaveBeenCalledExactlyOnceWith(
      setup.companionShape,
      { x: 0, y: 200, width: 360, height: 150 },
    )
  })

  it('previews the companions while dragging and cleans up afterwards', () => {
    const setup = setupGroupResize()

    dragAndDrop(setup)

    expect(setup.canvas.addMarker).toHaveBeenCalledWith(
      setup.companionShape,
      'djs-resizing',
    )
    expect(setup.canvas.removeMarker).toHaveBeenCalledWith(
      setup.companionShape,
      'djs-resizing',
    )
  })

  it('leaves the companions alone when the resize is refused', () => {
    const setup = setupGroupResize()
    setup.context.canExecute = false

    dragAndDrop(setup)

    expect(setup.modeling.resizeShape).not.toHaveBeenCalled()
  })
})
