import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { useCallback, useEffect, useState, type RefObject } from 'react'

import {
  type MenuRect,
  unionOfRects,
} from '@/components/editor/element-menu/place-element-menu'
import {
  CLOSE_SPELLING_SUGGESTIONS_EVENT,
  OPEN_SPELLING_SUGGESTIONS_EVENT,
  type SpellingSuggestionRequest,
} from '@/components/editor/spelling/spelling-events'
import type { EditorStatus } from '@/hooks/editor/useSelectedElements'

interface SuggestionsEventBus {
  on(event: string, callback: (event: never) => void): void
  off(event: string, callback: (event: never) => void): void
  fire(event: string): void
}

export interface OpenSpellingSuggestions {
  word: string
  anchor: MenuRect
  replaceWith: (suggestion: string) => void
}

export function useLabelSpellingSuggestions(
  modelerRef: RefObject<BpmnModeler | null>,
  containerRef: RefObject<HTMLElement | null>,
  status: EditorStatus,
) {
  const [openSuggestions, setOpenSuggestions] =
    useState<OpenSpellingSuggestions | null>(null)

  useEffect(() => {
    const modeler = modelerRef.current
    if (status !== 'ready' || !modeler) return
    const eventBus = modeler.get<SuggestionsEventBus>('eventBus')

    function showSuggestions(request: SpellingSuggestionRequest) {
      const container = containerRef.current
      if (!container) return
      setOpenSuggestions({
        word: request.word,
        anchor: unionOfRects([request.anchor], container.getBoundingClientRect()),
        replaceWith: request.replaceWith,
      })
    }

    function hideSuggestions() {
      setOpenSuggestions(null)
    }

    eventBus.on(OPEN_SPELLING_SUGGESTIONS_EVENT, showSuggestions)
    eventBus.on(CLOSE_SPELLING_SUGGESTIONS_EVENT, hideSuggestions)
    return () => {
      eventBus.off(OPEN_SPELLING_SUGGESTIONS_EVENT, showSuggestions)
      eventBus.off(CLOSE_SPELLING_SUGGESTIONS_EVENT, hideSuggestions)
      setOpenSuggestions(null)
    }
  }, [modelerRef, containerRef, status])

  const closeSuggestions = useCallback(() => {
    setOpenSuggestions(null)
    modelerRef.current
      ?.get<SuggestionsEventBus>('eventBus')
      .fire(CLOSE_SPELLING_SUGGESTIONS_EVENT)
  }, [modelerRef])

  return { openSuggestions, closeSuggestions }
}
