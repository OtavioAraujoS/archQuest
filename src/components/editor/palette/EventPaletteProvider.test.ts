import { describe, expect, it, vi } from 'vitest'

import EventPaletteProvider, { EVENT_MENU_ID } from './EventPaletteProvider'
import { EVENT_VARIANTS } from './event-variants'

function setup() {
  const services = {
    palette: { registerProvider: vi.fn() },
    popupMenu: { registerProvider: vi.fn(), open: vi.fn(), close: vi.fn() },
    create: { start: vi.fn() },
    elementFactory: {
      createShape: vi.fn((attrs: Record<string, unknown>) => ({ ...attrs })),
    },
    canvas: { getRootElement: vi.fn(() => ({ id: 'root' })) },
  }
  const provider = new EventPaletteProvider(
    services.palette,
    services.popupMenu,
    services.create,
    services.elementFactory,
    services.canvas,
  )
  return { provider, services }
}

describe('EventPaletteProvider', () => {
  it('registers itself as palette and popup menu provider', () => {
    const { provider, services } = setup()

    expect(services.palette.registerProvider).toHaveBeenCalledWith(provider)
    expect(services.popupMenu.registerProvider).toHaveBeenCalledWith(
      EVENT_MENU_ID,
      provider,
    )
  })

  it('adds a single grouped entry to the event section of the palette', () => {
    const { provider } = setup()

    const entries = provider.getPaletteEntries()

    expect(Object.keys(entries)).toEqual(['archquest.events'])
    expect(entries['archquest.events'].group).toBe('event')
  })

  it('opens the events popup next to the clicked palette entry', () => {
    const { provider, services } = setup()
    const button = document.createElement('div')
    button.className = 'entry'
    button.getBoundingClientRect = () =>
      ({ right: 50, top: 120 }) as DOMRect
    document.body.append(button)
    const event = new MouseEvent('click', { clientX: 30, clientY: 130 })
    Object.defineProperty(event, 'target', { value: button })

    provider.getPaletteEntries()['archquest.events'].action.click(event)

    expect(services.popupMenu.open).toHaveBeenCalledWith(
      { id: 'root' },
      EVENT_MENU_ID,
      { x: 58, y: 120, cursor: { x: 30, y: 130 } },
      expect.objectContaining({ title: 'Eventos' }),
    )
  })

  it('offers one popup entry per event variant', () => {
    const { provider } = setup()

    const entries = provider.getPopupMenuEntries()

    expect(Object.values(entries).map((entry) => entry.label)).toEqual(
      EVENT_VARIANTS.map((variant) => variant.label),
    )
  })

  it.each(EVENT_VARIANTS)(
    'creates $label with its event definition on click and drag',
    (variant) => {
      const { provider, services } = setup()
      const entry = provider.getPopupMenuEntries()[
        `archquest.create.${variant.id}`
      ]
      const event = new MouseEvent('click')

      entry.action.click(event)
      entry.action.dragstart(event)

      expect(services.elementFactory.createShape).toHaveBeenCalledWith({
        type: variant.type,
        eventDefinitionType: variant.eventDefinitionType,
      })
      expect(services.create.start).toHaveBeenCalledTimes(2)
      expect(services.create.start).toHaveBeenCalledWith(event, {
        type: variant.type,
        eventDefinitionType: variant.eventDefinitionType,
      })
      expect(services.popupMenu.close).toHaveBeenCalledTimes(2)
    },
  )
})
