import type { PaletteGroup, PaletteVariant } from './palette-group'

type CreateVariant = (event: Event, variant: PaletteVariant) => void

export function groupMenuId(group: PaletteGroup) {
  return `archquest-${group.id}`
}

export function variantMenuEntryKey(
  group: PaletteGroup,
  variant: PaletteVariant,
) {
  return `archquest.create.${group.id}.${variant.id}`
}

export function buildGroupMenuEntries(
  group: PaletteGroup,
  createVariant: CreateVariant,
) {
  return Object.fromEntries(
    group.variants.map((variant) => [
      variantMenuEntryKey(group, variant),
      {
        label: variant.label,
        className: variant.className,
        action: {
          click: (event: Event) => createVariant(event, variant),
          dragstart: (event: Event) => createVariant(event, variant),
        },
      },
    ]),
  )
}
