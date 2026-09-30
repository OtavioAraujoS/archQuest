import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  findSpellingIssues,
  replaceSpellingIssue,
} from '@/lib/spelling/find-spelling-issues'

const { checkWords } = vi.hoisted(() => ({
  checkWords: vi.fn<(words: string[]) => Promise<ReadonlySet<string>>>(),
}))

vi.mock('@/lib/spelling/spelling-client', () => ({ checkWords }))

describe('findSpellingIssues', () => {
  beforeEach(() => {
    checkWords.mockReset()
  })

  it('reports each misspelled word with its position', async () => {
    checkWords.mockResolvedValue(new Set(['proceso', 'solicitacao']))

    await expect(
      findSpellingIssues('Iniciar proceso de solicitacao'),
    ).resolves.toEqual([
      { word: 'proceso', start: 8, end: 15 },
      { word: 'solicitacao', start: 19, end: 30 },
    ])
  })

  it('reports every occurrence of a repeated misspelling', async () => {
    checkWords.mockResolvedValue(new Set(['proceso']))

    await expect(findSpellingIssues('proceso proceso')).resolves.toHaveLength(2)
  })

  it('looks up decomposed accents in their composed form', async () => {
    checkWords.mockResolvedValue(new Set())

    await findSpellingIssues('aprovação')

    expect(checkWords).toHaveBeenCalledWith(['aprovação'])
  })

  it('never asks the checker about text without checkable words', async () => {
    await expect(findSpellingIssues('RH 2024')).resolves.toEqual([])
    expect(checkWords).not.toHaveBeenCalled()
  })
})

describe('replaceSpellingIssue', () => {
  it('swaps only the misspelled word', () => {
    expect(
      replaceSpellingIssue(
        'Iniciar proceso hoje',
        { word: 'proceso', start: 8, end: 15 },
        'processo',
      ),
    ).toBe('Iniciar processo hoje')
  })
})
