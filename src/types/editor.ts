import type { MenuRect } from '@/components/editor/element-menu/place-element-menu'

export type EditorStatus = 'loading' | 'ready' | 'error'

export interface OpenSpellingSuggestions {
  word: string
  anchor: MenuRect
  replaceWith: (suggestion: string) => void
}
