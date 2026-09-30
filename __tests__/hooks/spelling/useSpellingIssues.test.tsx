import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  TYPING_PAUSE_BEFORE_SPELLING_CHECK_MS,
  useSpellingIssues,
} from '@/hooks/spelling/useSpellingIssues'
import type { SpellingIssue } from '@/lib/spelling/find-spelling-issues'

const { findSpellingIssues } = vi.hoisted(() => ({
  findSpellingIssues: vi.fn<(text: string) => Promise<SpellingIssue[]>>(),
}))

vi.mock('@/lib/spelling/find-spelling-issues', () => ({ findSpellingIssues }))

const MISSPELLED_PROCESS = { word: 'proceso', start: 0, end: 7 }

async function waitForTypingPause() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(TYPING_PAUSE_BEFORE_SPELLING_CHECK_MS)
  })
}

describe('useSpellingIssues', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    findSpellingIssues.mockReset()
    findSpellingIssues.mockResolvedValue([])
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('reports the issues once the user pauses typing', async () => {
    findSpellingIssues.mockResolvedValue([MISSPELLED_PROCESS])
    const { result } = renderHook(() => useSpellingIssues('proceso'))

    expect(result.current).toEqual([])
    await waitForTypingPause()

    expect(result.current).toEqual([MISSPELLED_PROCESS])
  })

  it('checks only the latest text while the user keeps typing', async () => {
    const { rerender } = renderHook(({ text }) => useSpellingIssues(text), {
      initialProps: { text: 'proc' },
    })

    rerender({ text: 'proceso' })
    await waitForTypingPause()

    expect(findSpellingIssues).toHaveBeenCalledTimes(1)
    expect(findSpellingIssues).toHaveBeenCalledWith('proceso')
  })

  it('hides issues that belong to a text that has already changed', async () => {
    findSpellingIssues.mockResolvedValue([MISSPELLED_PROCESS])
    const { result, rerender } = renderHook(
      ({ text }) => useSpellingIssues(text),
      { initialProps: { text: 'proceso' } },
    )
    await waitForTypingPause()

    rerender({ text: 'processo' })

    expect(result.current).toEqual([])
  })

  it('ignores an answer that arrives after the text changed', async () => {
    let answerFirstCheck: (issues: SpellingIssue[]) => void = () => {}
    findSpellingIssues.mockReturnValueOnce(
      new Promise((resolve) => {
        answerFirstCheck = resolve
      }),
    )
    const { result, rerender } = renderHook(
      ({ text }) => useSpellingIssues(text),
      { initialProps: { text: 'proceso' } },
    )
    await waitForTypingPause()

    rerender({ text: 'processo' })
    await act(async () => answerFirstCheck([MISSPELLED_PROCESS]))
    await waitForTypingPause()

    expect(result.current).toEqual([])
  })
})
