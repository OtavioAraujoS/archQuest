import { useLatestAnswer } from '@/hooks/ui/useLatestAnswer'
import { dictionaryFormOf } from '@/lib/spelling/portuguese-word-forms'
import { suggestCorrections } from '@/lib/spelling/spelling-client'

const NO_SUGGESTIONS: string[] = []

function suggestCorrectionsForTypedWord(word: string) {
  return suggestCorrections(dictionaryFormOf(word))
}

export function useSpellingSuggestions(word: string) {
  const answeredWord = useLatestAnswer(word, suggestCorrectionsForTypedWord)
  return {
    suggestions: answeredWord?.answer ?? NO_SUGGESTIONS,
    isLoading: answeredWord === null,
  }
}
