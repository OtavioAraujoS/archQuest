const PORTUGUESE_LOCALE = 'pt-BR'

export const COMPOUND_SEPARATOR_PATTERN = "[-'’]"

export function dictionaryFormOf(word: string) {
  return word.normalize('NFC')
}

export function inPortugueseLowerCase(word: string) {
  return word.toLocaleLowerCase(PORTUGUESE_LOCALE)
}

export function inPortugueseUpperCase(word: string) {
  return word.toLocaleUpperCase(PORTUGUESE_LOCALE)
}
