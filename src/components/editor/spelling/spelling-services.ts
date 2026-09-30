export interface LabeledElement {
  id: string
  type?: string
  parent?: unknown
  businessObject?: unknown
  label?: LabeledElement
  labelTarget?: LabeledElement
}

export interface DirectEditingEvent {
  active?: { element: LabeledElement } | null
}

export interface ChangedElementsEvent {
  elements: LabeledElement[]
}

export interface RemovedElementEvent {
  element: LabeledElement
}

export interface SpellingEventBus {
  on(events: string | string[], callback: (event: never) => void): void
  fire(event: string, payload?: unknown): void
}

export interface DirectEditingTextBox {
  content: HTMLElement
  parent: HTMLElement
}

export interface DirectEditingService {
  _textbox?: DirectEditingTextBox
  activate(element: LabeledElement): boolean
}

export interface OverlayPosition {
  top: number
  left?: number
  right?: number
}

export interface SpellingOverlay {
  position: OverlayPosition
  html: HTMLElement
  show: { minZoom: number }
  scale: { min: number; max: number }
}

export interface OverlaysService {
  add(element: LabeledElement, type: string, overlay: SpellingOverlay): string
  remove(overlayId: string): void
}

export interface LabeledElementRegistry {
  get(id: string): LabeledElement | undefined
  filter(isWanted: (element: LabeledElement) => boolean): LabeledElement[]
}
