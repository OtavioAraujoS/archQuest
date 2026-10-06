import { useEffect, useState } from 'react'

import { isDarkThemeActive } from '@/lib/theme'

export function useIsDarkTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState(isDarkThemeActive)

  useEffect(() => {
    const themeClassObserver = new MutationObserver(() =>
      setIsDarkTheme(isDarkThemeActive()),
    )
    themeClassObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => themeClassObserver.disconnect()
  }, [])

  return isDarkTheme
}
