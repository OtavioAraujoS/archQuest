import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  createSpellingRequestHandler,
  type WordChecker,
} from '@/lib/spelling/spelling-request-handler'

function makeChecker(
  correctWords: string[],
  suggestionsByWord: Record<string, string[]> = {},
): WordChecker {
  return {
    lookup: (word) => ({ correct: correctWords.includes(word) }),
    suggest: vi.fn((word: string) => suggestionsByWord[word] ?? []),
  }
}

function setupHandler(checker: WordChecker) {
  const loadChecker = vi.fn(() => Promise.resolve(checker))
  return { loadChecker, answer: createSpellingRequestHandler(loadChecker) }
}

describe('createSpellingRequestHandler', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('answers a check with only the misspelled words', async () => {
    const { answer } = setupHandler(makeChecker(['processo', 'de']))

    await expect(
      answer({ id: 7, kind: 'check', words: ['processo', 'de', 'proceso'] }),
    ).resolves.toEqual({ id: 7, kind: 'checked', misspelled: ['proceso'] })
  })

  it('accepts a compound when every part is a known word', async () => {
    const { answer } = setupHandler(makeChecker(['pré', 'cadastro']))

    await expect(
      answer({ id: 1, kind: 'check', words: ['pré-cadastro', 'pré-cadastrro'] }),
    ).resolves.toEqual({ id: 1, kind: 'checked', misspelled: ['pré-cadastrro'] })
  })

  it('drops suggestions that split the word and keeps at most five', async () => {
    const { answer } = setupHandler(
      makeChecker([], {
        pagamneto: [
          'paga neto',
          'pagamento',
          'pagam-neto',
          'pagamentos',
          'pagamenta',
          'pagamente',
          'pagamenti',
          'pagamentu',
        ],
      }),
    )

    await expect(
      answer({ id: 2, kind: 'suggest', word: 'pagamneto' }),
    ).resolves.toEqual({
      id: 2,
      kind: 'suggested',
      suggestions: [
        'pagamento',
        'pagamentos',
        'pagamenta',
        'pagamente',
        'pagamenti',
      ],
    })
  })

  it('suggests for the lowercase word and restores the capital letter', async () => {
    const checker = makeChecker([], { proceso: ['processo'] })
    const { answer } = setupHandler(checker)

    await expect(
      answer({ id: 3, kind: 'suggest', word: 'Proceso' }),
    ).resolves.toEqual({ id: 3, kind: 'suggested', suggestions: ['Processo'] })
    expect(checker.suggest).toHaveBeenCalledWith('proceso', expect.any(Number))
  })

  it('loads the checker only once', async () => {
    const { answer, loadChecker } = setupHandler(makeChecker(['fim']))

    await answer({ id: 1, kind: 'check', words: ['fim'] })
    await answer({ id: 2, kind: 'suggest', word: 'fin' })

    expect(loadChecker).toHaveBeenCalledTimes(1)
  })

  it('answers failed when the checker cannot be loaded', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const answer = createSpellingRequestHandler(() =>
      Promise.reject(new Error('dictionary missing')),
    )

    await expect(
      answer({ id: 9, kind: 'check', words: ['fim'] }),
    ).resolves.toEqual({ id: 9, kind: 'failed' })
  })
})
