import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { getPreferredTheme, setTheme as persistTheme, type Theme } from '@/lib/theme'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme())

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    persistTheme(next)
    setTheme(next)
  }

  return (
    <Button variant="outline" size="icon" onClick={toggle} aria-label="Alternar tema">
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
