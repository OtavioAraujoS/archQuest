import {
  readStoredValue,
  writeStoredValue,
} from '@/lib/storage/safe-local-storage'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'archquest-theme'

export function getPreferredTheme(): Theme {
  const storedTheme = readStoredValue(STORAGE_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function setTheme(theme: Theme): boolean {
  applyTheme(theme)
  return writeStoredValue(STORAGE_KEY, theme)
}
