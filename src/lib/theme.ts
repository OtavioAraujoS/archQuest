export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'archquest-theme'

export function getPreferredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch (error) {
    console.error('Failed to read stored theme', error)
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function setTheme(theme: Theme): boolean {
  applyTheme(theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
    return true
  } catch (error) {
    console.error('Failed to persist theme', error)
    return false
  }
}
