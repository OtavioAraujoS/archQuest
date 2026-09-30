import {
  COMPOUND_SEPARATOR_PATTERN,
  inPortugueseLowerCase,
  inPortugueseUpperCase,
} from '@/lib/spelling/portuguese-word-forms'
import {
  MAX_SUGGESTIONS,
  type SpellingRequest,
  type SpellingResponse,
} from '@/lib/spelling/spelling-protocol'

export interface WordChecker {
  lookup(word: string): { correct: boolean }
  suggest(word: string, max: number): string[]
}

const COMPOUND_SEPARATOR = new RegExp(COMPOUND_SEPARATOR_PATTERN)
const SUGGESTIONS_REQUESTED_BEFORE_FILTERING = MAX_SUGGESTIONS * 3

function isSpelledCorrectly(checker: WordChecker, word: string) {
  if (checker.lookup(word).correct) return true
  const parts = word.split(COMPOUND_SEPARATOR)
  return (
    parts.length > 1 &&
    parts.every((part) => part.length < 2 || checker.lookup(part).correct)
  )
}

function isCapitalized(word: string) {
  const firstLetter = word.charAt(0)
  return (
    firstLetter !== inPortugueseLowerCase(firstLetter) &&
    word.slice(1) === inPortugueseLowerCase(word.slice(1))
  )
}

function capitalize(word: string) {
  return inPortugueseUpperCase(word.charAt(0)) + word.slice(1)
}

function splitsTheWord(word: string, suggestion: string) {
  return (
    /\s/.test(suggestion) || (suggestion.includes('-') && !word.includes('-'))
  )
}

function suggestCorrections(checker: WordChecker, word: string) {
  const wasCapitalized = isCapitalized(word)
  const searchedWord = wasCapitalized ? inPortugueseLowerCase(word) : word
  return checker
    .suggest(searchedWord, SUGGESTIONS_REQUESTED_BEFORE_FILTERING)
    .filter((suggestion) => !splitsTheWord(searchedWord, suggestion))
    .slice(0, MAX_SUGGESTIONS)
    .map((suggestion) => (wasCapitalized ? capitalize(suggestion) : suggestion))
}

export function createSpellingRequestHandler(
  loadChecker: () => Promise<WordChecker>,
) {
  let checkerPromise: Promise<WordChecker> | null = null

  return async function answerSpellingRequest(
    request: SpellingRequest,
  ): Promise<SpellingResponse> {
    try {
      checkerPromise ??= loadChecker()
      const checker = await checkerPromise
      if (request.kind === 'check') {
        const misspelled = request.words.filter(
          (word) => !isSpelledCorrectly(checker, word),
        )
        return { id: request.id, kind: 'checked', misspelled }
      }
      const suggestions = suggestCorrections(checker, request.word)
      return { id: request.id, kind: 'suggested', suggestions }
    } catch (error) {
      console.error('Failed to answer spelling request', error)
      return { id: request.id, kind: 'failed' }
    }
  }
}
