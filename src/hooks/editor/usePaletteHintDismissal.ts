import { useState } from 'react'

import {
  readStoredValue,
  writeStoredValue,
} from '@/lib/storage/safe-local-storage'

export const PALETTE_HINT_STORAGE_KEY = 'archquest-palette-hint-dismissed'

export function usePaletteHintDismissal() {
  const [isHintDismissed, setIsHintDismissed] = useState(
    () => readStoredValue(PALETTE_HINT_STORAGE_KEY) === 'true',
  )

  function dismissHint() {
    setIsHintDismissed(true)
    writeStoredValue(PALETTE_HINT_STORAGE_KEY, 'true')
  }

  return { isHintDismissed, dismissHint }
}
