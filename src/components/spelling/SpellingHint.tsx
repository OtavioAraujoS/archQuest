import { useState } from 'react'

import { SpellingSuggestionList } from '@/components/spelling/SpellingSuggestionList'
import { useSpellingIssues } from '@/hooks/spelling/useSpellingIssues'
import { replaceSpellingIssue } from '@/lib/spelling/find-spelling-issues'
import { cn } from '@/lib/utils'

interface SpellingHintProps {
  text: string
  onReplaceText: (correctedText: string) => void
  className?: string
}

export function SpellingHint({
  text,
  onReplaceText,
  className,
}: Readonly<SpellingHintProps>) {
  const issues = useSpellingIssues(text)
  const [openIssueStart, setOpenIssueStart] = useState<number | null>(null)
  const openIssue = issues.find((issue) => issue.start === openIssueStart)

  if (issues.length === 0) return null

  return (
    <div className={cn('text-xs', className)}>
      <output className="text-muted-foreground flex flex-wrap items-center gap-x-1.5 gap-y-1">
        Verifique a ortografia:
        {issues.map((issue) => (
          <button
            key={issue.start}
            type="button"
            aria-expanded={issue === openIssue}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() =>
              setOpenIssueStart(issue === openIssue ? null : issue.start)
            }
            className="text-foreground decoration-destructive focus-visible:ring-ring/50 rounded-sm underline decoration-wavy underline-offset-2 outline-none focus-visible:ring-[3px]"
          >
            {issue.word}
          </button>
        ))}
      </output>
      {openIssue && (
        <div className="mt-1">
          <SpellingSuggestionList
            word={openIssue.word}
            onChoose={(suggestion) => {
              setOpenIssueStart(null)
              onReplaceText(replaceSpellingIssue(text, openIssue, suggestion))
            }}
          />
        </div>
      )}
    </div>
  )
}
