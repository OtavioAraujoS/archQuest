import type { CreateService, ElementFactoryService, PopupMenuService } from '@/types/diagram-js-services'

export type Entry = {
  className: string
  title: string
  group: string
  action: {
    click: (event: Event) => void
    dragstart: (event: Event) => void
  }
}

export type TypeOfGateway =
  'Exclusivo' | 'Paralelo' | 'Inclusivo' | 'Baseado em eventos' | 'Complexo'

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

export type CreateVariant = (event: Event, variant: PaletteVariant) => void

export interface GroupPaletteEntryActions {
  openMenu: (event: MouseEvent) => void
  createDefaultVariant: (event: Event) => void
}

export type PaletteEntries = Record<string, unknown>

export interface VariantCreationServices {
  create: CreateService
  elementFactory: ElementFactoryService
  popupMenu: PopupMenuService
}
