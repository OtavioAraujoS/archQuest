import type BpmnModeler from 'bpmn-js/lib/Modeler'
import type { RefObject } from 'react'

import type { MenuRect } from '@/components/editor/element-menu/place-element-menu'
import type { DiagramElement } from '@/lib/bpmn/diagram-element-ancestry'
import type { createDiagramAutosave } from '@/lib/diagrams/diagram-autosave'

export type EditorStatus = 'loading' | 'ready' | 'error'

export type DiagramAutosave = ReturnType<typeof createDiagramAutosave>

export interface OpenSpellingSuggestions {
  word: string
  anchor: MenuRect
  replaceWith: (suggestion: string) => void
}

export interface MenuTarget {
  parent?: unknown
  labelTarget?: MenuTarget
}

export interface MenuOpeningEvent {
  element: MenuTarget
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
