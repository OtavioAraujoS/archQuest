import { vi } from 'vitest'

import type { Entry } from '@/types/pallete'

import GroupedPaletteProvider from './GroupedPaletteProvider'
import { groupMenuId } from './group-menu-entries'
import type { PaletteGroup } from './palette-group'

export type MenuEntry = Entry & { label: string }

type RegisteredPopupMenus = Map<
  string,
  { getPopupMenuEntries: () => Record<string, MenuEntry> }
>

export const DEFAULT_BPMN_PALETTE_ENTRIES = {
  'create.exclusive-gateway': { group: 'gateway' },
  'create.task': { group: 'activity' },
  'create.subprocess-expanded': { group: 'activity' },
  'create.data-object': { group: 'data-object' },
}

export function createFakeDiagramServices() {
  const registeredPopupMenus: RegisteredPopupMenus = new Map()
  const services = {
    palette: { registerProvider: vi.fn() },
    popupMenu: {
      registerProvider: vi.fn((id, provider) =>
        registeredPopupMenus.set(id, provider),
      ),
      open: vi.fn(),
      close: vi.fn(),
    },
    create: { start: vi.fn() },
    elementFactory: {
      createShape: vi.fn((attrs: Record<string, unknown>) => ({ ...attrs })),
    },
    canvas: { getRootElement: vi.fn(() => ({ id: 'root' })) },
  }
  return { services, registeredPopupMenus }
}

export function setupGroupedPalette() {
  const { services, registeredPopupMenus } = createFakeDiagramServices()
  const provider = new GroupedPaletteProvider(
    services.palette,
    services.popupMenu,
    services.create,
    services.elementFactory,
    services.canvas,
  )
  const paletteEntries = provider.getPaletteEntries()({
    ...DEFAULT_BPMN_PALETTE_ENTRIES,
  }) as Record<string, Entry>

  function getGroupMenuEntries(group: PaletteGroup) {
    return registeredPopupMenus.get(groupMenuId(group))!.getPopupMenuEntries()
  }

  return { services, registeredPopupMenus, paletteEntries, getGroupMenuEntries }
}
