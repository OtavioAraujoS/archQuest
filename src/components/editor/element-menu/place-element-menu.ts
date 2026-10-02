import type { MenuRect, Size } from '@/types/geometry'

export const MENU_GAP = 8

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

export function placeElementMenu(anchor: MenuRect, menu: Size, canvas: Size) {
  const topAbove = anchor.top - MENU_GAP - menu.height
  const fitsAbove = topAbove >= MENU_GAP
  const topBelow = anchor.top + anchor.height + MENU_GAP
  const top = fitsAbove
    ? topAbove
    : clamp(topBelow, MENU_GAP, canvas.height - menu.height - MENU_GAP)
  const centeredLeft = anchor.left + anchor.width / 2 - menu.width / 2
  return {
    top,
    left: clamp(centeredLeft, MENU_GAP, canvas.width - menu.width - MENU_GAP),
    placement: fitsAbove ? ('above' as const) : ('below' as const),
  }
}

export function unionOfRects(
  rects: MenuRect[],
  origin: { left: number; top: number },
) {
  const left = Math.min(...rects.map((rect) => rect.left))
  const top = Math.min(...rects.map((rect) => rect.top))
  const right = Math.max(...rects.map((rect) => rect.left + rect.width))
  const bottom = Math.max(...rects.map((rect) => rect.top + rect.height))
  return {
    left: left - origin.left,
    top: top - origin.top,
    width: right - left,
    height: bottom - top,
  }
}
