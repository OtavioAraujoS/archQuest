export const SPELLING_HIGHLIGHT_NAME = 'archquest-spelling-error'

function highlightRegistry() {
  const isSupported =
    typeof CSS !== 'undefined' &&
    'highlights' in CSS &&
    typeof Highlight !== 'undefined'
  return isSupported ? CSS.highlights : null
}

export function clearSpellingHighlights() {
  highlightRegistry()?.delete(SPELLING_HIGHLIGHT_NAME)
}

export function paintSpellingHighlights(misspelledRanges: Range[]) {
  if (misspelledRanges.length === 0) return clearSpellingHighlights()
  highlightRegistry()?.set(
    SPELLING_HIGHLIGHT_NAME,
    new Highlight(...misspelledRanges),
  )
}
