import { useRef } from 'react'

import { SpellingSuggestionList } from '@/components/spelling/SpellingSuggestionList'
import { useElementMenuPlacement } from '@/hooks/editor/element-menu/useElementMenuPlacement'
import type { OpenSpellingSuggestions } from '@/hooks/editor/spelling/useLabelSpellingSuggestions'
import { useDismissOnOutsideOrEscape } from '@/hooks/ui/useDismissOnOutsideOrEscape'

interface LabelSpellingPopoverProps {
  openSuggestions: OpenSpellingSuggestions | null
  onClose: () => void
}

export function LabelSpellingPopover({
  openSuggestions,
  onClose,
}: Readonly<LabelSpellingPopoverProps>) {
  const popoverRef = useRef<HTMLDialogElement>(null)

  useElementMenuPlacement(popoverRef, openSuggestions?.anchor ?? null)
  useDismissOnOutsideOrEscape(popoverRef, openSuggestions !== null, onClose)

  if (!openSuggestions) return null

  return (
    <dialog
      ref={popoverRef}
      open
      aria-label={`Ortografia de ${openSuggestions.word}`}
      className="bg-popover text-popover-foreground absolute right-auto z-20 min-w-32 rounded-xl border p-1 shadow-lg"
    >
      <SpellingSuggestionList
        word={openSuggestions.word}
        onChoose={openSuggestions.replaceWith}
      />
    </dialog>
  )
}
