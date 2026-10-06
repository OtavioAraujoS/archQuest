import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ACCEPTED_TERMS_STORAGE_KEY } from '@/lib/spelling/accepted-terms'

async function freshModules() {
  vi.resetModules()
  const terms = await import('@/lib/spelling/accepted-terms')
  const { tokenizeWords } = await import('@/lib/spelling/tokenize-words')
  return { ...terms, tokenizeWords }
}

describe('acceptTerm', () => {
  beforeEach(() => localStorage.clear())

  it('stops checking the accepted word, in any capitalization', async () => {
    const { acceptTerm, tokenizeWords } = await freshModules()

    acceptTerm('Kafka')

    expect(tokenizeWords('Fila kafka').map((t) => t.word)).toEqual(['Fila'])
  })

  it('remembers accepted words after the page reloads', async () => {
    ;(await freshModules()).acceptTerm('Kafka')

    const { isAcceptedTerm } = await freshModules()

    expect(isAcceptedTerm('KAFKA')).toBe(true)
    expect(localStorage.getItem(ACCEPTED_TERMS_STORAGE_KEY)).toBe('["kafka"]')
  })

  it('ignores a corrupted stored dictionary', async () => {
    localStorage.setItem(ACCEPTED_TERMS_STORAGE_KEY, '{oops')

    const { isAcceptedTerm } = await freshModules()

    expect(isAcceptedTerm('workflow')).toBe(true)
  })
})
