export interface MenuPosition {
  x: number
  y: number
  cursor?: { x: number; y: number }
}

export interface PaletteService {
  registerProvider(priority: number, provider: unknown): void
}

export interface PopupMenuService {
  registerProvider(id: string, provider: unknown): void
  open(
    target: unknown,
    providerId: string,
    position: MenuPosition,
    options?: Record<string, unknown>,
  ): void
  close(): void
}

export interface CreateService {
  start(event: Event, elements: unknown, context?: Record<string, unknown>): void
}

export interface ElementFactoryService {
  createShape(attrs: Record<string, unknown>): unknown
}

export interface CanvasService {
  getRootElement(): unknown
}

export interface ModelingService {
  updateModdleProperties(
    element: unknown,
    moddleElement: unknown,
    properties: Record<string, unknown>,
  ): void
}

export interface CommandStackService {
  execute(command: string, context: Record<string, unknown>): void
  registerHandler(command: string, handlerClass: unknown): void
}

export interface BpmnFactoryService {
  create<T = unknown>(type: string, attrs?: Record<string, unknown>): T
}
