import { act, renderHook } from '@testing-library/react'
import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { describe, expect, it, vi } from 'vitest'

import {
  CLOSE_SPELLING_SUGGESTIONS_EVENT,
  OPEN_SPELLING_SUGGESTIONS_EVENT,
} from '@/components/editor/spelling/spelling-events'
import { useLabelSpellingSuggestions } from '@/hooks/editor/spelling/useLabelSpellingSuggestions'
import type { EditorStatus } from '@/hooks/editor/useSelectedElements'

import { createElementMenuModeler, rect } from '../element-menu/element-menu-fakes'

function renderSuggestionsHook(status: EditorStatus = 'ready') {
  const { modeler, eventBus } = createElementMenuModeler(() => rect(0, 0, 0, 0))
  const container = document.createElement('div')
  container.getBoundingClientRect = () => rect(100, 50, 800, 600)
  const modelerRef = { current: modeler }
  const containerRef = { current: container }
  const hook = renderHook(() =>
    useLabelSpellingSuggestions(modelerRef, containerRef, status),
  )
  return { ...hook, eventBus }
}

function requestSuggestions(eventBus: { fire(event: string, payload?: unknown): void }) {
  const replaceWith = vi.fn()
  act(() =>
    eventBus.fire(OPEN_SPELLING_SUGGESTIONS_EVENT, {
      word: 'proceso',
      anchor: rect(140, 80, 50, 14),
      replaceWith,
    }),
  )
  return replaceWith
}

describe('useLabelSpellingSuggestions', () => {
  it('opens the suggestions anchored relative to the canvas container', () => {
    const { result, eventBus } = renderSuggestionsHook()

    const replaceWith = requestSuggestions(eventBus)

    expect(result.current.openSuggestions).toEqual({
      word: 'proceso',
      anchor: { left: 40, top: 30, width: 50, height: 14 },
      replaceWith,
    })
  })

  it('closes the suggestions when the editor asks for it', () => {
    const { result, eventBus } = renderSuggestionsHook()
    requestSuggestions(eventBus)

    act(() => eventBus.fire(CLOSE_SPELLING_SUGGESTIONS_EVENT))

    expect(result.current.openSuggestions).toBeNull()
  })

  it('tells the editor when the user closes the suggestions', () => {
    const { result, eventBus } = renderSuggestionsHook()
    const editorHeardClosing = vi.fn()
    eventBus.on(CLOSE_SPELLING_SUGGESTIONS_EVENT, editorHeardClosing)
    requestSuggestions(eventBus)

    act(() => result.current.closeSuggestions())

    expect(result.current.openSuggestions).toBeNull()
    expect(editorHeardClosing).toHaveBeenCalled()
  })

  it('ignores requests until the diagram is ready', () => {
    const { result, eventBus } = renderSuggestionsHook('loading')

    requestSuggestions(eventBus)

    expect(result.current.openSuggestions).toBeNull()
  })

  it('stays closed without a modeler', () => {
    const modelerRef = { current: null as BpmnModeler | null }
    const containerRef = { current: null }
    const { result } = renderHook(() =>
      useLabelSpellingSuggestions(modelerRef, containerRef, 'ready'),
    )

    expect(() => act(() => result.current.closeSuggestions())).not.toThrow()
    expect(result.current.openSuggestions).toBeNull()
  })
})
