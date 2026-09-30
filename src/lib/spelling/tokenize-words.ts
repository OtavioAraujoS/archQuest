import { isAcceptedTerm } from '@/lib/spelling/accepted-terms'
import {
  COMPOUND_SEPARATOR_PATTERN,
  inPortugueseUpperCase,
} from '@/lib/spelling/portuguese-word-forms'

export interface WordToken {
  word: string
  start: number
  end: number
}

const WHITESPACE_DELIMITED_CHUNK = /\S+/g
const LETTERS_PATTERN = String.raw`[\p{L}\p{M}]+`
const WORD_WITH_OPTIONAL_COMPOUND_PARTS = new RegExp(
  `${LETTERS_PATTERN}(?:${COMPOUND_SEPARATOR_PATTERN}${LETTERS_PATTERN})*`,
  'gu',
)
const NON_PROSE_CHUNK = /[\p{N}@_\\]|:\/\/|^www\.|\.\p{L}/u
const LOWERCASE_FOLLOWED_BY_UPPERCASE = /\p{Ll}\p{Lu}/u
const SHORTEST_CHECKABLE_WORD_LENGTH = 2

function isAcronym(word: string) {
  return word === inPortugueseUpperCase(word)
}

function isCheckableWord(word: string) {
  return (
    word.length >= SHORTEST_CHECKABLE_WORD_LENGTH &&
    !isAcronym(word) &&
    !LOWERCASE_FOLLOWED_BY_UPPERCASE.test(word) &&
    !isAcceptedTerm(word)
  )
}

export function tokenizeWords(text: string): WordToken[] {
  const tokens: WordToken[] = []

  for (const chunk of text.matchAll(WHITESPACE_DELIMITED_CHUNK)) {
    if (NON_PROSE_CHUNK.test(chunk[0])) continue

    for (const match of chunk[0].matchAll(WORD_WITH_OPTIONAL_COMPOUND_PARTS)) {
      if (!isCheckableWord(match[0])) continue
      const start = chunk.index + match.index
      tokens.push({ word: match[0], start, end: start + match[0].length })
    }
  }

  return tokens
}
