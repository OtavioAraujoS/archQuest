import type {
  CanvasService,
  MenuPosition,
  PopupMenuService,
} from '@/types/diagram-js-services'

import { groupMenuId } from './group-menu-entries'
import type { PaletteGroup } from './palette-group'

const MENU_OFFSET_FROM_BUTTON = 8

export function menuPositionNextToClickedButton(
  event: MouseEvent,
): MenuPosition {
  const clickedElement = event.target instanceof Element ? event.target : null
  const buttonRect = (
    clickedElement?.closest('.entry') ?? clickedElement
  )?.getBoundingClientRect()

  return {
    x: (buttonRect?.right ?? event.clientX) + MENU_OFFSET_FROM_BUTTON,
    y: buttonRect?.top ?? event.clientY,
    cursor: { x: event.clientX, y: event.clientY },
  }
}

export function openGroupMenu(
  popupMenu: PopupMenuService,
  canvas: CanvasService,
  event: MouseEvent,
  group: PaletteGroup,
) {
  popupMenu.open(
    canvas.getRootElement(),
    groupMenuId(group),
    menuPositionNextToClickedButton(event),
    { title: group.menuTitle, search: true },
  )
}
