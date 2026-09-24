import { useState } from 'react'

export const PALETTE_HINT_STORAGE_KEY = 'archquest-palette-hint-dismissed'

function readHintDismissal() {
  try {
    return localStorage.getItem(PALETTE_HINT_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function usePaletteHintDismissal() {
  const [isHintDismissed, setIsHintDismissed] = useState(readHintDismissal)

  function dismissHint() {
    setIsHintDismissed(true)
    try {
      localStorage.setItem(PALETTE_HINT_STORAGE_KEY, 'true')
    } catch (error) {
      console.error('Failed to remember the palette hint dismissal', error)
    }
  }

  return { isHintDismissed, dismissHint }
}
