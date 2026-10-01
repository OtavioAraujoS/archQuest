import type { DiagramElement } from '@/lib/bpmn/diagram-element-ancestry'

export interface LabeledElement extends DiagramElement {
  id: string
  type?: string
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

export interface CheckedLabel {
  text: string
  overlayId?: string
}

export interface TextPiece {
  node: Text
  start: number
}

export interface EditableTextSnapshot {
  text: string
  pieces: TextPiece[]
}

export interface DocumentTypingCommands {
  execCommand?: (command: 'insertText', showUI: false, text: string) => boolean
}

export interface SpellingSuggestionRequest {
  word: string
  anchor: DOMRect
  replaceWith: (suggestion: string) => void
}
