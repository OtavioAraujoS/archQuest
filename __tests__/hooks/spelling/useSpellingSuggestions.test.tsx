import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSpellingSuggestions } from '@/hooks/spelling/useSpellingSuggestions'

const { suggestCorrections } = vi.hoisted(() => ({
  suggestCorrections: vi.fn<(word: string) => Promise<string[]>>(),
}))

vi.mock('@/lib/spelling/spelling-client', () => ({ suggestCorrections }))

describe('useSpellingSuggestions', () => {
  beforeEach(() => {
    suggestCorrections.mockReset()
  })

  it('is loading until the suggestions arrive', async () => {
    suggestCorrections.mockResolvedValue(['processo'])
    const { result } = renderHook(() => useSpellingSuggestions('proceso'))

    expect(result.current).toEqual({ suggestions: [], isLoading: true })
    await waitFor(() =>
      expect(result.current).toEqual({
        suggestions: ['processo'],
        isLoading: false,
      }),
    )
  })

  it('loads again when the word changes', async () => {
    suggestCorrections.mockImplementation((word) =>
      Promise.resolve(word === 'proceso' ? ['processo'] : ['usuário']),
    )
    const { result, rerender } = renderHook(
      ({ word }) => useSpellingSuggestions(word),
      { initialProps: { word: 'proceso' } },
    )
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    rerender({ word: 'usuario' })

    expect(result.current).toEqual({ suggestions: [], isLoading: true })
    await waitFor(() => expect(result.current.suggestions).toEqual(['usuário']))
  })
})
