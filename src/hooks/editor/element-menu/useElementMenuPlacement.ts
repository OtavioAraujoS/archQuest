import { useLayoutEffect, type RefObject } from 'react'

import {
  type MenuRect,
  placeElementMenu,
} from '@/components/editor/element-menu/place-element-menu'

export function useElementMenuPlacement(
  menuRef: RefObject<HTMLElement | null>,
  anchor: MenuRect | null,
) {
  useLayoutEffect(() => {
    const menu = menuRef.current
    const canvas = menu?.parentElement
    if (!menu || !canvas || !anchor) return
    const placedMenu = menu

    function placeMenu() {
      const { top, left, placement } = placeElementMenu(
        anchor!,
        { width: placedMenu.offsetWidth, height: placedMenu.offsetHeight },
        { width: canvas!.clientWidth, height: canvas!.clientHeight },
      )
      placedMenu.style.top = `${top}px`
      placedMenu.style.left = `${left}px`
      placedMenu.dataset.placement = placement
    }

    placeMenu()
    if (typeof ResizeObserver === 'undefined') return
    const menuSizeObserver = new ResizeObserver(placeMenu)
    menuSizeObserver.observe(placedMenu)
    return () => menuSizeObserver.disconnect()
  }, [menuRef, anchor])
}
