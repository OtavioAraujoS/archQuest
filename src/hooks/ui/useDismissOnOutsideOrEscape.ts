import { useEffect, type RefObject } from 'react'

export function useDismissOnOutsideOrEscape(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  onDismiss: (reason: 'outside' | 'escape') => void,
) {
  useEffect(() => {
    if (!isActive) return

    function dismissOnOutsidePointer(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        onDismiss('outside')
      }
    }

    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onDismiss('escape')
    }

    document.addEventListener('pointerdown', dismissOnOutsidePointer)
    document.addEventListener('keydown', dismissOnEscape)
    return () => {
      document.removeEventListener('pointerdown', dismissOnOutsidePointer)
      document.removeEventListener('keydown', dismissOnEscape)
    }
  }, [containerRef, isActive, onDismiss])
}
