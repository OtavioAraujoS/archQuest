const MENU_ITEM_SELECTOR = '[role="menuitem"]:not([aria-disabled="true"])'

const FOCUS_STEP_BY_KEY: Record<string, number> = {
  ArrowDown: 1,
  ArrowUp: -1,
}

function menuItemsOf(menu: HTMLElement) {
  return Array.from(menu.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR))
}

export function focusFirstMenuItem(menu: HTMLElement) {
  menuItemsOf(menu)[0]?.focus()
}

export function moveMenuFocus(menu: HTMLElement, key: string) {
  const menuItems = menuItemsOf(menu)
  if (menuItems.length === 0) return false
  if (key === 'Home') {
    menuItems[0].focus()
    return true
  }
  if (key === 'End') {
    menuItems.at(-1)?.focus()
    return true
  }
  const step = FOCUS_STEP_BY_KEY[key]
  if (!step) return false
  const focusedIndex = menuItems.indexOf(document.activeElement as HTMLElement)
  const nextIndex = (focusedIndex + step + menuItems.length) % menuItems.length
  menuItems[nextIndex].focus()
  return true
}
