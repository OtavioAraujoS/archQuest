import type { GroupPaletteEntryActions, PaletteGroup } from '@/types/palette'

export const PALETTE_GROUP_CLASS = 'archquest-palette-group'

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
