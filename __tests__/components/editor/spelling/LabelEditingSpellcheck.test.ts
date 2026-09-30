import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import LabelEditingSpellcheck, {
  TYPING_PAUSE_BEFORE_LABEL_CHECK_MS,
} from '@/components/editor/spelling/LabelEditingSpellcheck'
import {
  CLOSE_SPELLING_SUGGESTIONS_EVENT,
  OPEN_SPELLING_SUGGESTIONS_EVENT,
} from '@/components/editor/spelling/spelling-events'

import {
  createDirectEditingTextBox,
  createSpellingEventBus,
} from './spelling-module-fakes'

const { spellingClient, highlights } = await vi.hoisted(async () => {
  const { createFakeSpellingClient } = await import(
    '../../spelling/fake-spelling-client'
  )
  return {
    spellingClient: createFakeSpellingClient(),
    highlights: {
      paintSpellingHighlights: vi.fn<(ranges: Range[]) => void>(),
      clearSpellingHighlights: vi.fn(),
    },
  }
})

vi.mock('@/lib/spelling/spelling-client', () => spellingClient)
vi.mock('@/components/editor/spelling/spelling-highlights', () => highlights)

function paintedWords() {
  return highlights.paintSpellingHighlights.mock.lastCall?.[0].map(String)
}

async function startEditing(text: string) {
  const eventBus = createSpellingEventBus()
  const textBox = createDirectEditingTextBox(text)
  new LabelEditingSpellcheck(eventBus, { _textbox: textBox, activate: vi.fn() })
  eventBus.fire('directEditing.activate', { active: { element: { id: 'Task' } } })
  await vi.advanceTimersByTimeAsync(0)
  return { eventBus, ...textBox }
}

function clickInsideWord(content: HTMLElement, caretOffset: number) {
  window.getSelection()?.collapse(content.firstChild, caretOffset)
  content.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

describe('LabelEditingSpellcheck', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    spellingClient.forgetMisspellings()
    spellingClient.treatAsMisspelled('proceso', ['processo'])
    Range.prototype.getBoundingClientRect = () => new DOMRect(10, 20, 30, 12)
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.replaceChildren()
  })

  it('underlines the misspelled words when editing starts', async () => {
    const { content } = await startEditing('Novo proceso')

    expect(paintedWords()).toEqual(['proceso'])
    expect(content.lang).toBe('pt-BR')
    expect(content.spellcheck).toBe(false)
  })

  it('checks again once the user pauses typing', async () => {
    const { content } = await startEditing('Novo processo')
    content.textContent = 'Novo proceso'

    content.dispatchEvent(new Event('input'))
    await vi.advanceTimersByTimeAsync(TYPING_PAUSE_BEFORE_LABEL_CHECK_MS)

    expect(paintedWords()).toEqual(['proceso'])
  })

  it('cleans up once even when editing ends twice', async () => {
    const { eventBus, content } = await startEditing('Novo proceso')

    eventBus.fire('directEditing.deactivate', { active: null })
    eventBus.fire('directEditing.deactivate', { active: null })
    eventBus.fire('diagram.clear')

    expect(highlights.clearSpellingHighlights).toHaveBeenCalledTimes(1)
    expect(content.hasAttribute('spellcheck')).toBe(false)
  })

  it('offers suggestions for the misspelled word under the caret', async () => {
    const { eventBus, content } = await startEditing('Novo proceso')

    clickInsideWord(content, 8)

    expect(eventBus.fire).toHaveBeenCalledWith(
      OPEN_SPELLING_SUGGESTIONS_EVENT,
      expect.objectContaining({ word: 'proceso' }),
    )
  })

  it('offers nothing when the caret is on a correct word', async () => {
    const { eventBus, content } = await startEditing('Novo proceso')

    clickInsideWord(content, 2)

    expect(eventBus.fire).not.toHaveBeenCalledWith(
      OPEN_SPELLING_SUGGESTIONS_EVENT,
      expect.anything(),
    )
  })

  it('replaces the word with the chosen suggestion and closes the list', async () => {
    const { eventBus, content } = await startEditing('Novo proceso')
    clickInsideWord(content, 8)
    const [, request] = eventBus.fire.mock.lastCall!

    ;(request as { replaceWith(suggestion: string): void }).replaceWith('processo')

    expect(content.textContent).toBe('Novo processo')
    expect(eventBus.fire).toHaveBeenLastCalledWith(CLOSE_SPELLING_SUGGESTIONS_EVENT)
  })

  it('lets Escape close only the suggestions while they are open', async () => {
    const { eventBus, content } = await startEditing('Novo proceso')
    const cancelEditing = vi.fn()
    content.addEventListener('keydown', cancelEditing)
    clickInsideWord(content, 8)

    content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(eventBus.fire).toHaveBeenCalledWith(CLOSE_SPELLING_SUGGESTIONS_EVENT)
    expect(cancelEditing).toHaveBeenCalledTimes(1)
  })

  it('stays off when the label text box cannot be reached', () => {
    const eventBus = createSpellingEventBus()

    new LabelEditingSpellcheck(eventBus, { activate: vi.fn() })

    expect(() => eventBus.fire('directEditing.activate')).not.toThrow()
  })
})
