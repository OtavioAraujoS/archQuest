import { useEffect, useState } from 'react'

interface AnsweredQuestion<Answer> {
  question: string
  answer: Answer
}

export function useLatestAnswer<Answer>(
  question: string,
  answerQuestion: (question: string) => Promise<Answer>,
  pauseBeforeAskingMs?: number,
) {
  const [answeredQuestion, setAnsweredQuestion] =
    useState<AnsweredQuestion<Answer> | null>(null)

  useEffect(() => {
    let isOutdated = false

    function ask() {
      void answerQuestion(question).then((answer) => {
        if (!isOutdated) setAnsweredQuestion({ question, answer })
      })
    }

    const pauseTimer =
      pauseBeforeAskingMs === undefined
        ? undefined
        : setTimeout(ask, pauseBeforeAskingMs)
    if (pauseTimer === undefined) ask()

    return () => {
      isOutdated = true
      clearTimeout(pauseTimer)
    }
  }, [question, answerQuestion, pauseBeforeAskingMs])

  return answeredQuestion?.question === question ? answeredQuestion : null
}
