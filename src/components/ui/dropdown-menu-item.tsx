import type { ReactNode } from 'react'

import { useDropdownMenu } from '@/components/ui/dropdown-menu-context'

interface DropdownMenuItemProps {
  onSelect: () => void
  disabled?: boolean
  hint?: string
  children: ReactNode
}

export function DropdownMenuItem({
  onSelect,
  disabled = false,
  hint,
  children,
}: Readonly<DropdownMenuItemProps>) {
  const { closeMenu } = useDropdownMenu()

  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled}
      title={hint}
      onClick={() => {
        if (disabled) return
        closeMenu()
        onSelect()
      }}
      className="hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0"
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator() {
  return <hr className="border-border -mx-1 my-1" />
}

export function DropdownMenuLabel({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="text-muted-foreground px-2 pt-1.5 pb-1 text-xs font-medium">
      {children}
    </div>
  )
}
