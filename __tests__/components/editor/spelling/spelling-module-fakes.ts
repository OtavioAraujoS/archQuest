import { vi } from 'vitest'

import type {
  LabeledElement,
  SpellingOverlay,
} from '@/components/editor/spelling/spelling-services'

type Listener = (event: never) => void

export function createSpellingEventBus() {
  const listeners = new Map<string, Listener[]>()

  return {
    on(events: string | string[], listener: Listener) {
      for (const event of [events].flat()) {
        listeners.set(event, [...(listeners.get(event) ?? []), listener])
      }
    },
    fire: vi.fn((event: string, payload: unknown = {}) => {
      listeners.get(event)?.forEach((listener) => listener(payload as never))
    }),
  }
}

export function createDirectEditingTextBox(text: string) {
  const parent = document.createElement('div')
  const content = document.createElement('div')
  content.textContent = text
  parent.append(content)
  document.body.append(parent)
  return { parent, content }
}

export function createFakeOverlays() {
  const addedOverlays = new Map<
    string,
    { element: LabeledElement; overlay: SpellingOverlay }
  >()
  let nextOverlayNumber = 1

  return {
    addedOverlays,
    add: vi.fn((element: LabeledElement, _type: string, overlay: SpellingOverlay) => {
      const overlayId = `overlay-${nextOverlayNumber++}`
      addedOverlays.set(overlayId, { element, overlay })
      return overlayId
    }),
    remove: vi.fn((overlayId: string) => {
      addedOverlays.delete(overlayId)
    }),
  }
}

export function createFakeElementRegistry(elements: LabeledElement[]) {
  return {
    get: (id: string) => elements.find((element) => element.id === id),
    filter: (isWanted: (element: LabeledElement) => boolean) =>
      elements.filter(isWanted),
  }
}

export function makeLabeledTask(id: string, name: string): LabeledElement {
  return {
    id,
    type: 'bpmn:Task',
    parent: {},
    businessObject: {
      name,
      $instanceOf: (type: string) => type === 'bpmn:FlowElement',
    },
  }
}

export function renameLabeledElement(element: LabeledElement, name: string) {
  ;(element.businessObject as { name: string }).name = name
}
