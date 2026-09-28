import { describe, expect, it } from 'vitest'

import { findResizeTargets } from '@/components/editor/multi-resize/find-resize-targets'
import { allowEveryResize, makeResizableShape } from './group-resize-fakes'

const BOUNDS = { x: 0, y: 0, width: 100, height: 100 }

describe('findResizeTargets', () => {
  it('keeps every selected shape the rules let resize', () => {
    const firstPool = makeResizableShape('bpmn:Participant', BOUNDS)
    const secondPool = makeResizableShape('bpmn:Participant', BOUNDS)

    expect(
      findResizeTargets([firstPool, secondPool], allowEveryResize),
    ).toEqual([firstPool, secondPool])
  })

  it('leaves out shapes whose container is also selected', () => {
    const pool = makeResizableShape('bpmn:Participant', BOUNDS)
    const group = makeResizableShape('bpmn:Group', BOUNDS, pool)

    expect(findResizeTargets([pool, group], allowEveryResize)).toEqual([pool])
  })

  it('leaves out lanes, labels, connections and fixed-size shapes', () => {
    const pool = makeResizableShape('bpmn:Participant', BOUNDS)
    const lane = makeResizableShape('bpmn:Lane', BOUNDS)
    const label = {
      ...makeResizableShape('bpmn:Task', BOUNDS),
      labelTarget: pool,
    }
    const flow = {
      ...makeResizableShape('bpmn:SequenceFlow', BOUNDS),
      waypoints: [],
    }
    const task = makeResizableShape('bpmn:Task', BOUNDS)
    const rules = {
      allowed: (_action: string, { shape }: { shape?: unknown }) =>
        shape !== task,
    }

    expect(findResizeTargets([pool, lane, label, flow, task], rules)).toEqual([
      pool,
    ])
  })
})
