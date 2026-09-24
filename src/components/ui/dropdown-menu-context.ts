import { createContext, useContext } from 'react'

export const DropdownMenuContext = createContext<{ closeMenu: () => void }>({
  closeMenu: () => {},
})

export function useDropdownMenu() {
  return useContext(DropdownMenuContext)
}
