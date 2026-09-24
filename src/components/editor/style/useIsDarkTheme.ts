import { useEffect, useState } from 'react'

function documentHasDarkTheme() {
  return document.documentElement.classList.contains('dark')
}

export function useIsDarkTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState(documentHasDarkTheme)

  useEffect(() => {
    const themeClassObserver = new MutationObserver(() =>
      setIsDarkTheme(documentHasDarkTheme()),
    )
    themeClassObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => themeClassObserver.disconnect()
  }, [])

  return isDarkTheme
}
