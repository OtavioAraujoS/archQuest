import { vi } from 'vitest'

export function createFakeSpellingClient() {
  const correctionsByMisspelling = new Map<string, string[]>()

  return {
    checkWords: vi.fn((words: string[]) =>
      Promise.resolve(
        new Set(words.filter((word) => correctionsByMisspelling.has(word))),
      ),
    ),
    suggestCorrections: vi.fn((word: string) =>
      Promise.resolve(correctionsByMisspelling.get(word) ?? []),
    ),
    isSpellingEngineUnavailable: vi.fn(() => false),
    treatAsMisspelled(word: string, corrections: string[]) {
      correctionsByMisspelling.set(word, corrections)
    },
    forgetMisspellings() {
      correctionsByMisspelling.clear()
    },
  }
}
