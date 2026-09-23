export interface PaletteVariant {
  id: string
  label: string
  className: string
  attrs: Record<string, unknown>
  withStartEvent?: boolean
}

export interface PaletteGroup {
  id: string
  entryKey: string
  paletteGroup: string
  className: string
  title: string
  menuTitle: string
  variants: PaletteVariant[]
}
