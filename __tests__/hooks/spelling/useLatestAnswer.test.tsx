import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useLatestAnswer } from '@/hooks/spelling/useLatestAnswer'

const PAUSE_BEFORE_ASKING_MS = 200

const answerQuestion = vi.fn<(question: string) => Promise<string>>()

function answerInUpperCase(question: string) {
  return Promise.resolve(question.toUpperCase())
}

async function waitForPause() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(PAUSE_BEFORE_ASKING_MS)
  })
}

describe('useLatestAnswer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    answerQuestion.mockReset()
    answerQuestion.mockImplementation(answerInUpperCase)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('asks right away when no pause is requested', async () => {
    const { result } = renderHook(() => useLatestAnswer('ata', answerQuestion))

    expect(result.current).toBeNull()
    expect(answerQuestion).toHaveBeenCalledWith('ata')
    await act(async () => {})

    expect(result.current).toEqual({ question: 'ata', answer: 'ATA' })
  })

  it('waits for the pause before asking', async () => {
    const { result } = renderHook(() =>
      useLatestAnswer('ata', answerQuestion, PAUSE_BEFORE_ASKING_MS),
    )

    expect(answerQuestion).not.toHaveBeenCalled()
    await waitForPause()

    expect(result.current).toEqual({ question: 'ata', answer: 'ATA' })
  })

  it('asks only the latest question when it changes during the pause', async () => {
    const { rerender } = renderHook(
      ({ question }) =>
        useLatestAnswer(question, answerQuestion, PAUSE_BEFORE_ASKING_MS),
      { initialProps: { question: 'at' } },
    )

    rerender({ question: 'ata' })
    await waitForPause()

    expect(answerQuestion).toHaveBeenCalledTimes(1)
    expect(answerQuestion).toHaveBeenCalledWith('ata')
  })

  it('has no answer while the new question is still unanswered', async () => {
    const { result, rerender } = renderHook(
      ({ question }) => useLatestAnswer(question, answerQuestion),
      { initialProps: { question: 'ata' } },
    )
    await act(async () => {})

    rerender({ question: 'nota' })

    expect(result.current).toBeNull()
  })

  it('ignores an answer that arrives after the question changed', async () => {
    let answerFirstQuestion: (answer: string) => void = () => {}
    answerQuestion.mockReturnValueOnce(
      new Promise((resolve) => {
        answerFirstQuestion = resolve
      }),
    )
    const { result, rerender } = renderHook(
      ({ question }) => useLatestAnswer(question, answerQuestion),
      { initialProps: { question: 'ata' } },
    )

    rerender({ question: 'nota' })
    await act(async () => answerFirstQuestion('ATA'))

    expect(result.current).toEqual({ question: 'nota', answer: 'NOTA' })
  })
})
