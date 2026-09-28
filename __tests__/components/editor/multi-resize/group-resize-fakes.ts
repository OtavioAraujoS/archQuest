import { BpmnModdle } from 'bpmn-moddle'
import { vi } from 'vitest'

import type {
  Bounds,
  ResizableShape,
} from '@/components/editor/multi-resize/multi-resize-services'

const moddle = new BpmnModdle()

export function makeResizableShape(
  type: string,
  bounds: Bounds,
  parent?: ResizableShape,
): ResizableShape {
  return { businessObject: moddle.create(type), parent, ...bounds }
}

export function createFakeEventBus() {
  const listeners = new Map<string, ((event: unknown) => void)[]>()
  return {
    on: vi.fn(
      (event: string, _priority: number, callback: (event: never) => void) =>
        listeners.set(event, [
          ...(listeners.get(event) ?? []),
          callback as (event: unknown) => void,
        ]),
    ),
    fire(event: string, payload: unknown) {
      listeners.get(event)?.forEach((callback) => callback(payload))
    },
  }
}

export const allowEveryResize = { allowed: () => true }

export const smallestResizeBox = {
  computeMinResizeBox: ({
    shape,
    minDimensions,
  }: {
    shape: Bounds
    minDimensions?: { width: number; height: number }
  }) => ({
    x: shape.x,
    y: shape.y,
    width: minDimensions?.width ?? 10,
    height: minDimensions?.height ?? 10,
  }),
}

export function createSvgElement(tagName: string) {
  return document.createElementNS('http://www.w3.org/2000/svg', tagName)
}
