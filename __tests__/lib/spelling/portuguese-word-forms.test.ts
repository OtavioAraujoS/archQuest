import { describe, expect, it } from 'vitest'

import {
  COMPOUND_SEPARATOR_PATTERN,
  dictionaryFormOf,
  inPortugueseLowerCase,
  inPortugueseUpperCase,
} from '@/lib/spelling/portuguese-word-forms'

const DECOMPOSED_ACAO = 'ação'
const COMPOSED_ACAO = 'ação'

describe('portuguese word forms', () => {
  it('composes accents the way the dictionary stores them', () => {
    expect(dictionaryFormOf(DECOMPOSED_ACAO)).toBe(COMPOSED_ACAO)
  })

  it('changes the case of accented letters', () => {
    expect(inPortugueseLowerCase('AÇÃO')).toBe('ação')
    expect(inPortugueseUpperCase('ação')).toBe('AÇÃO')
  })

  it.each(['guarda-chuva', "d'água", 'd’água'])(
    'splits the compound %s into its parts',
    (compound) => {
      const parts = compound.split(new RegExp(COMPOUND_SEPARATOR_PATTERN))

      expect(parts).toHaveLength(2)
    },
  )

  it('does not split a word without separators', () => {
    expect('processo'.split(new RegExp(COMPOUND_SEPARATOR_PATTERN))).toEqual([
      'processo',
    ])
  })
})
