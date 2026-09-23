import { EVENT_VARIANTS, type EventVariant } from './event-variants'

export const EVENT_MENU_ID = 'archquest-events'
const MENU_OFFSET = 8

interface Palette {
  registerProvider(provider: unknown): void
}

interface PopupMenu {
  registerProvider(id: string, provider: unknown): void
  open(
    target: unknown,
    providerId: string,
    position: { x: number; y: number; cursor?: { x: number; y: number } },
    options?: Record<string, unknown>,
  ): void
  close(): void
}

interface Create {
  start(event: Event, shape: unknown): void
}

interface ElementFactory {
  createShape(attrs: Record<string, unknown>): unknown
}

interface Canvas {
  getRootElement(): unknown
}

export default class EventPaletteProvider {
  static readonly $inject = [
    'palette',
    'popupMenu',
    'create',
    'elementFactory',
    'canvas',
  ]

  private readonly popupMenu: PopupMenu
  private readonly create: Create
  private readonly elementFactory: ElementFactory
  private readonly canvas: Canvas

  constructor(
    palette: Palette,
    popupMenu: PopupMenu,
    create: Create,
    elementFactory: ElementFactory,
    canvas: Canvas,
  ) {
    this.popupMenu = popupMenu
    this.create = create
    this.elementFactory = elementFactory
    this.canvas = canvas

    palette.registerProvider(this)
    popupMenu.registerProvider(EVENT_MENU_ID, this)
  }

  getPaletteEntries() {
    return {
      'archquest.events': {
        group: 'event',
        className: 'bpmn-icon-start-event-timer archquest-palette-group',
        title: 'Eventos de mensagem e timer',
        action: { click: (event: MouseEvent) => this.openMenu(event) },
      },
    }
  }

  getPopupMenuEntries() {
    return Object.fromEntries(
      EVENT_VARIANTS.map((variant) => [
        `archquest.create.${variant.id}`,
        {
          label: variant.label,
          className: variant.className,
          action: {
            click: (event: Event) => this.startCreate(event, variant),
            dragstart: (event: Event) => this.startCreate(event, variant),
          },
        },
      ]),
    )
  }

  private openMenu(event: MouseEvent) {
    const button = event.target instanceof Element ? event.target : null
    const rect = (button?.closest('.entry') ?? button)?.getBoundingClientRect()

    this.popupMenu.open(
      this.canvas.getRootElement(),
      EVENT_MENU_ID,
      {
        x: (rect?.right ?? event.clientX) + MENU_OFFSET,
        y: rect?.top ?? event.clientY,
        cursor: { x: event.clientX, y: event.clientY },
      },
      { title: 'Eventos', search: true },
    )
  }

  private startCreate(event: Event, variant: EventVariant) {
    const shape = this.elementFactory.createShape({
      type: variant.type,
      eventDefinitionType: variant.eventDefinitionType,
    })
    this.popupMenu.close()
    this.create.start(event, shape)
  }
}
