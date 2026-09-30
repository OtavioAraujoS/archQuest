export const MAX_SUGGESTIONS = 5

export type SpellingQuestion =
  | { kind: 'check'; words: string[] }
  | { kind: 'suggest'; word: string }

export type SpellingRequest = SpellingQuestion & { id: number }

export type SpellingResponse =
  | { id: number; kind: 'checked'; misspelled: string[] }
  | { id: number; kind: 'suggested'; suggestions: string[] }
  | { id: number; kind: 'failed' }
