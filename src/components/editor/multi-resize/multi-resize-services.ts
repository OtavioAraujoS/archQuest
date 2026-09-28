import type { DiagramElement } from '@/lib/bpmn/diagram-element-ancestry'

export interface Bounds {
  x: number
  y: number
  width: number
  height: number
}

export type ResizableShape = DiagramElement &
  Bounds & {
    waypoints?: unknown[]
  }

export type ResizeDirection = 'n' | 'w' | 's' | 'e' | 'nw' | 'ne' | 'se' | 'sw'

export interface GroupResizeContext {
  shape: ResizableShape
  direction: ResizeDirection
  newBounds?: Bounds
  canExecute?: unknown
  companionShapes?: ResizableShape[]
  companionBounds?: Map<ResizableShape, Bounds>
  companionFrames?: Map<ResizableShape, SVGElement>
}

export interface ResizeEvent {
  context: GroupResizeContext
}

export interface GroupResizeEventBus {
  on(event: string, priority: number, callback: (event: never) => void): void
}

export interface SelectionService {
  get(): ResizableShape[]
  isSelected(element: unknown): boolean
}

export interface RulesService {
  allowed(action: string, context: Record<string, unknown>): unknown
}

export interface ResizeService {
  computeMinResizeBox(context: Record<string, unknown>): Bounds
}

export interface ResizeHandlesService {
  addResizer(shape: ResizableShape): void
  removeResizers(): void
}

export interface ShapeResizingService {
  resizeShape(shape: ResizableShape, newBounds: Bounds): void
}

export interface PreviewSupportService {
  addFrame(shape: ResizableShape, layer: SVGElement): SVGElement
}

export interface ResizeCanvasService {
  getActiveLayer(): SVGElement
  addMarker(element: unknown, marker: string): void
  removeMarker(element: unknown, marker: string): void
}
