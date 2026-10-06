import { SpellCheck } from 'lucide-react'

import { DropdownMenu } from '@/components/ui/dropdown-menu'
import {
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu-item'
import type { DiagramSpellingIssue } from '@/types/spelling'

interface SpellingIssuesMenuProps {
  issues: DiagramSpellingIssue[]
  onGoToIssue: (elementId: string) => void
}

export function SpellingIssuesMenu({
  issues,
  onGoToIssue,
}: Readonly<SpellingIssuesMenuProps>) {
  const wordCount = issues.reduce(
    (total, issue) => total + issue.words.length,
    0,
  )

  return (
    <DropdownMenu
      menuLabel="Erros de ortografia"
      triggerAriaLabel={`Erros de ortografia: ${wordCount}`}
      trigger={
        <>
          <SpellCheck />
          {wordCount > 0 && (
            <span className="bg-destructive rounded-full px-1.5 text-xs leading-5 text-white">
              {wordCount}
            </span>
          )}
        </>
      }
    >
      {issues.length === 0 ? (
        <DropdownMenuLabel>Nenhum erro de ortografia</DropdownMenuLabel>
      ) : (
        <>
          <DropdownMenuLabel>
            Clique para corrigir no diagrama
          </DropdownMenuLabel>
          {issues.map((issue) => (
            <DropdownMenuItem
              key={issue.elementId}
              onSelect={() => onGoToIssue(issue.elementId)}
            >
              <span className="flex min-w-0 flex-col">
                <span className="decoration-destructive underline decoration-wavy underline-offset-2">
                  {issue.words.join(', ')}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  em “{issue.text}”
                </span>
              </span>
            </DropdownMenuItem>
          ))}
        </>
      )}
    </DropdownMenu>
  )
}
