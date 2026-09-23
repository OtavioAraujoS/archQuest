import type { PaletteGroup } from './palette-group'

export const PALETTE_GROUP_CLASS = 'archquest-palette-group'

interface GroupPaletteEntryActions {
  openMenu: (event: MouseEvent) => void
  createDefaultVariant: (event: Event) => void
}

export function buildGroupPaletteEntry(
  group: PaletteGroup,
  actions: GroupPaletteEntryActions,
) {
  return {
    group: group.paletteGroup,
    className: `${group.className} ${PALETTE_GROUP_CLASS}`,
    title: group.title,
    action: {
      click: actions.openMenu,
      dragstart: actions.createDefaultVariant,
    },
  }
}
