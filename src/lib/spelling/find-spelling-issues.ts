import { dictionaryFormOf } from '@/lib/spelling/portuguese-word-forms'
import { checkWords } from '@/lib/spelling/spelling-client'
import { tokenizeWords, type WordToken } from '@/lib/spelling/tokenize-words'

export type SpellingIssue = WordToken

export async function findSpellingIssues(
  text: string,
): Promise<SpellingIssue[]> {
  const tokens = tokenizeWords(text)
  if (tokens.length === 0) return []

  const misspelledWords = await checkWords(
    tokens.map((token) => dictionaryFormOf(token.word)),
  )
  return tokens.filter((token) =>
    misspelledWords.has(dictionaryFormOf(token.word)),
  )
}

export function replaceSpellingIssue(
  text: string,
  issue: SpellingIssue,
  replacement: string,
) {
  return text.slice(0, issue.start) + replacement + text.slice(issue.end)
}
