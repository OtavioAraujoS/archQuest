import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { vi } from 'vitest'

type Listener = (event: never) => void

export function createElementMenuModeler(
  rectOf: (element: unknown) => DOMRect,
) {
  const listeners = new Map<string, Set<Listener>>()
  let selected: unknown[] = []
  const eventBus = {
    on: (event: string, listener: Listener) =>
      listeners.set(event, (listeners.get(event) ?? new Set()).add(listener)),
    off: (event: string, listener: Listener) =>
      listeners.get(event)?.delete(listener),
    fire: (event: string, payload: unknown = {}) =>
      listeners.get(event)?.forEach((listener) => listener(payload as never)),
  }
  const selection = {
    get: () => selected,
    isSelected: (element: unknown) => selected.includes(element),
    select: vi.fn((element: unknown) => {
      selected = element ? [element] : []
      eventBus.fire('selection.changed')
    }),
  }
  const services: Record<string, unknown> = {
    eventBus,
    selection,
    elementRegistry: {
      getGraphics: (element: unknown) => ({
        getBoundingClientRect: () => rectOf(element),
      }),
    },
  }
  const modeler = {
    get: (name: string) => services[name],
  } as unknown as BpmnModeler
  return { modeler, eventBus, selection }
}

export function rect(left: number, top: number, width: number, height: number) {
  return { left, top, width, height } as DOMRect
}
