import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { DropdownMenuContext } from '@/components/ui/dropdown-menu-context'
import {
  focusFirstMenuItem,
  moveMenuFocus,
} from '@/components/ui/move-menu-focus'
import { useDismissOnOutsideOrEscape } from '@/hooks/ui/useDismissOnOutsideOrEscape'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
  trigger: ReactNode
  menuLabel: string
  align?: 'start' | 'end'
  children: ReactNode
}

export function DropdownMenu({
  trigger,
  menuLabel,
  align = 'end',
  children,
}: Readonly<DropdownMenuProps>) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [])
  const dismissMenu = useCallback(
    (reason: 'outside' | 'escape') =>
      reason === 'escape' ? closeMenu() : setIsOpen(false),
    [closeMenu],
  )
  const menuContextValue = useMemo(() => ({ closeMenu }), [closeMenu])
  useDismissOnOutsideOrEscape(containerRef, isOpen, dismissMenu)

  useEffect(() => {
    if (isOpen && menuRef.current) focusFirstMenuItem(menuRef.current)
  }, [isOpen])

  function moveFocusWithArrows(event: KeyboardEvent<HTMLDivElement>) {
    if (menuRef.current && moveMenuFocus(menuRef.current, event.key)) {
      event.preventDefault()
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Button
        ref={triggerRef}
        variant="outline"
        size="sm"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
      >
        {trigger}
      </Button>
      {isOpen && (
        <DropdownMenuContext.Provider value={menuContextValue}>
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            tabIndex={-1}
            aria-label={menuLabel}
            onKeyDown={moveFocusWithArrows}
            className={cn(
              'bg-popover text-popover-foreground absolute top-full z-50 mt-1 flex min-w-56 flex-col rounded-lg border p-1 shadow-lg',
              align === 'end' ? 'right-0' : 'left-0',
            )}
          >
            {children}
          </div>
        </DropdownMenuContext.Provider>
      )}
    </div>
  )
}
