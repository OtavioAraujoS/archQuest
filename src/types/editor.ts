import type BpmnModeler from 'bpmn-js/lib/Modeler'
import type { RefObject } from 'react'

import type { DiagramElement } from '@/lib/bpmn/diagram-element-ancestry'
import type { createDiagramAutosave } from '@/lib/diagrams/diagram-autosave'
import type {
  BpmnFactoryService,
  EventBusService,
  ModelingService,
} from '@/types/diagram-js-services'
import type { MenuRect } from '@/types/geometry'

export type EditorStatus = 'loading' | 'ready' | 'error'

export type ConflictChoice = 'keep-local' | 'load-cloud'

export type SharingChange = 'publishing' | 'unpublishing'

export type TextFormat = 'bold' | 'italic' | 'underline'

export type TranslationReplacements = Record<string, string>

export type Rgb = [number, number, number]

export interface TextStyle {
  bold: boolean
  italic: boolean
  underline: boolean
  color?: string
}

export interface ModdleElement {
  $type: string
  $parent?: ModdleElement
  get: (name: string) => unknown
  [key: string]: unknown
}

export interface BpmnElementLike {
  businessObject?: ModdleElement
  labelTarget?: BpmnElementLike
}

export interface TextStyleServices {
  modeling: ModelingService
  bpmnFactory: BpmnFactoryService
  eventBus: Pick<EventBusService, 'fire'>
}

export type ColorModeling = ModelingService & {
  setColor(
    elements: unknown[],
    colors: { fill?: string; stroke?: string },
  ): void
}

export type DiagramAutosave = ReturnType<typeof createDiagramAutosave>

export interface OpenSpellingSuggestions {
  word: string
  anchor: MenuRect
  replaceWith: (suggestion: string) => void
}

export interface MenuOpeningEvent {
  element: DiagramElement
  originalEvent?: Event
}

export interface RefusedConnectEvent {
  context: {
    start: DiagramElement
    hover?: DiagramElement | null
    canExecute?: unknown
  }
}

export interface RefusedConnectionNotice {
  message: string
  shownAt: number
}

export interface UseFileLinkOptions {
  diagramId: string | undefined
  diagramName: string
  modelerRef: RefObject<BpmnModeler | null>
  downloadBpmnInstead: () => void
}
