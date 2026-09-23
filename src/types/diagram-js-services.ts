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
