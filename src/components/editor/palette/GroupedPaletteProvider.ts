import type {
  CanvasService,
  CreateService,
  ElementFactoryService,
  PaletteService,
  PopupMenuService,
} from '@/types/diagram-js-services'

import { buildGroupMenuEntries, groupMenuId } from './group-menu-entries'
import { buildGroupPaletteEntry } from './group-palette-entry'
import { PALETTE_GROUPS } from './groups'
import { openGroupMenu } from './open-group-menu'
import type { PaletteGroup, PaletteVariant } from './palette-group'
import { startVariantCreation } from './start-variant-creation'

export const PRIORITY_AFTER_DEFAULT_PALETTE = 500

type PaletteEntries = Record<string, unknown>

export default class GroupedPaletteProvider {
  static readonly $inject = [
    'palette',
    'popupMenu',
    'create',
    'elementFactory',
    'canvas',
  ]

  private readonly popupMenu: PopupMenuService
  private readonly create: CreateService
  private readonly elementFactory: ElementFactoryService
  private readonly canvas: CanvasService
  private readonly groups: PaletteGroup[]

  constructor(
    palette: PaletteService,
    popupMenu: PopupMenuService,
    create: CreateService,
    elementFactory: ElementFactoryService,
    canvas: CanvasService,
    groups: PaletteGroup[] = PALETTE_GROUPS,
  ) {
    this.popupMenu = popupMenu
    this.create = create
    this.elementFactory = elementFactory
    this.canvas = canvas
    this.groups = groups

    palette.registerProvider(PRIORITY_AFTER_DEFAULT_PALETTE, this)
    for (const group of groups) {
      popupMenu.registerProvider(groupMenuId(group), {
        getPopupMenuEntries: () =>
          buildGroupMenuEntries(group, this.createVariant),
      })
    }
  }

  getPaletteEntries() {
    return (entries: PaletteEntries) => {
      for (const group of this.groups) {
        entries[group.entryKey] = buildGroupPaletteEntry(group, {
          openMenu: (event) =>
            openGroupMenu(this.popupMenu, this.canvas, event, group),
          createDefaultVariant: (event) =>
            this.createVariant(event, group.variants[0]),
        })
      }
      return entries
    }
  }

  private readonly createVariant = (event: Event, variant: PaletteVariant) =>
    startVariantCreation(
      {
        create: this.create,
        elementFactory: this.elementFactory,
        popupMenu: this.popupMenu,
      },
      event,
      variant,
    )
}
