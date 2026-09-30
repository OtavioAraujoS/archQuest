export const OPEN_SPELLING_SUGGESTIONS_EVENT =
  'archquest.spelling.openSuggestions'
export const CLOSE_SPELLING_SUGGESTIONS_EVENT =
  'archquest.spelling.closeSuggestions'

export interface SpellingSuggestionRequest {
  word: string
  anchor: DOMRect
  replaceWith: (suggestion: string) => void
}
