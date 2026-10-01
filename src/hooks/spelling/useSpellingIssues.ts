import { useLatestAnswer } from '@/hooks/ui/useLatestAnswer'
import {
  findSpellingIssues,
  type SpellingIssue,
} from '@/lib/spelling/find-spelling-issues'

export const TYPING_PAUSE_BEFORE_SPELLING_CHECK_MS = 300

const NO_SPELLING_ISSUES: SpellingIssue[] = []

export function useSpellingIssues(text: string) {
  const checkedText = useLatestAnswer(
    text,
    findSpellingIssues,
    TYPING_PAUSE_BEFORE_SPELLING_CHECK_MS,
  )
  return checkedText?.answer ?? NO_SPELLING_ISSUES
}
