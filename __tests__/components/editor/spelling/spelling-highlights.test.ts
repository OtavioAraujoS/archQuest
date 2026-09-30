import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  clearSpellingHighlights,
  paintSpellingHighlights,
  SPELLING_HIGHLIGHT_NAME,
} from '@/components/editor/spelling/spelling-highlights'

class FakeHighlight {
  readonly ranges: Range[]

  constructor(...ranges: Range[]) {
    this.ranges = ranges
  }
}

function supportHighlights() {
  const highlights = new Map<string, FakeHighlight>()
  vi.stubGlobal('CSS', { highlights })
  vi.stubGlobal('Highlight', FakeHighlight)
  return highlights
}

describe('spelling highlights', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('registers the misspelled ranges under the spelling highlight', () => {
    const highlights = supportHighlights()
    const misspelledRange = document.createRange()

    paintSpellingHighlights([misspelledRange])

    expect(highlights.get(SPELLING_HIGHLIGHT_NAME)?.ranges).toEqual([
      misspelledRange,
    ])
  })

  it('removes the highlight when nothing is misspelled anymore', () => {
    const highlights = supportHighlights()
    paintSpellingHighlights([document.createRange()])

    paintSpellingHighlights([])

    expect(highlights.has(SPELLING_HIGHLIGHT_NAME)).toBe(false)
  })

  it('clears the highlight', () => {
    const highlights = supportHighlights()
    paintSpellingHighlights([document.createRange()])

    clearSpellingHighlights()

    expect(highlights.size).toBe(0)
  })

  it('does nothing in browsers without the highlight API', () => {
    expect(() => {
      paintSpellingHighlights([document.createRange()])
      clearSpellingHighlights()
    }).not.toThrow()
  })
})
