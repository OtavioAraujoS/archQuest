import { describe, expect, it } from 'vitest'

import portugueseTranslationModule, {
  translateToPortuguese,
} from '@/components/editor/translations'

describe('translateToPortuguese', () => {
  it('translates the palette and context pad labels', () => {
    expect(translateToPortuguese('Activate hand tool')).toBe('Mover a tela')
    expect(translateToPortuguese('Append task')).toBe('Adicionar tarefa')
    expect(translateToPortuguese('Delete')).toBe('Excluir')
  })

  it('keeps unknown labels and fills their placeholders', () => {
    expect(translateToPortuguese('Hello {name}', { name: 'Ana' })).toBe(
      'Hello Ana',
    )
    expect(translateToPortuguese('Missing {value}')).toBe('Missing {value}')
  })

  it('replaces the diagram-js translate service', () => {
    expect(portugueseTranslationModule.translate).toEqual([
      'value',
      translateToPortuguese,
    ])
  })
})
