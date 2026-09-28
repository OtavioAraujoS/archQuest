import EventBus from 'diagram-js/lib/core/EventBus'
import { describe, expect, it } from 'vitest'

import {
  ACTIVITY_MIN_DIMENSIONS,
  ActivityResizeBehavior,
  ActivityResizeRules,
} from '@/components/editor/element-resize/activity-minimum-size'
import { makeActivityShape } from './activity-resize-shapes'

function canResize(shape: unknown, newBounds?: unknown) {
  const eventBus = new EventBus()
  new ActivityResizeRules(eventBus as never)
  return eventBus.fire('commandStack.shape.resize.canExecute', {
    context: { shape, newBounds },
  })
}

function startResizing(shape: unknown) {
  const eventBus = new EventBus()
  new ActivityResizeBehavior(eventBus as never)
  const context: Record<string, unknown> = { shape }
  eventBus.fire('resize.start', { context })
  return context
}

describe('ActivityResizeRules', () => {
  it('lets tasks, call activities and collapsed sub-processes resize', () => {
    expect(canResize(makeActivityShape('bpmn:UserTask'))).toBe(true)
    expect(canResize(makeActivityShape('bpmn:CallActivity'))).toBe(true)
    expect(
      canResize(makeActivityShape('bpmn:SubProcess', { isExpanded: false })),
    ).toBe(true)
  })

  it('refuses bounds below the activity minimum', () => {
    const task = makeActivityShape('bpmn:Task')

    expect(canResize(task, { width: 50, height: 40 })).toBe(true)
    expect(canResize(task, { width: 49, height: 40 })).toBe(false)
  })

  it('leaves events and gateways to the default BPMN rules', () => {
    expect(canResize(makeActivityShape('bpmn:StartEvent'))).toBeUndefined()
    expect(
      canResize(makeActivityShape('bpmn:ExclusiveGateway')),
    ).toBeUndefined()
  })
})

describe('ActivityResizeBehavior', () => {
  it('keeps resized tasks above the activity minimum', () => {
    expect(startResizing(makeActivityShape('bpmn:Task')).minDimensions).toBe(
      ACTIVITY_MIN_DIMENSIONS,
    )
  })

  it('leaves other shapes with their own limits', () => {
    expect(
      startResizing(makeActivityShape('bpmn:Participant')).minDimensions,
    ).toBeUndefined()
  })
})
