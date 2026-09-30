import {
  findSpellingIssues,
  type SpellingIssue,
} from '@/lib/spelling/find-spelling-issues'
import { isSpellingEngineUnavailable } from '@/lib/spelling/spelling-client'

import {
  caretOffsetIn,
  readEditableText,
  rangeOfTextSpan,
  replaceRangeText,
  type EditableTextSnapshot,
} from './editable-text'
import {
  CLOSE_SPELLING_SUGGESTIONS_EVENT,
  OPEN_SPELLING_SUGGESTIONS_EVENT,
  type SpellingSuggestionRequest,
} from './spelling-events'
import {
  clearSpellingHighlights,
  paintSpellingHighlights,
} from './spelling-highlights'
import type {
  DirectEditingService,
  DirectEditingTextBox,
  SpellingEventBus,
} from './spelling-services'

export const TYPING_PAUSE_BEFORE_LABEL_CHECK_MS = 400

const EDITING_ENDED_EVENTS = [
  'directEditing.deactivate',
  'diagram.clear',
  'diagram.destroy',
]

export default class LabelEditingSpellcheck {
  static readonly $inject = ['eventBus', 'directEditing']

  private readonly eventBus: SpellingEventBus
  private readonly textBox: DirectEditingTextBox | undefined
  private isChecking = false
  private areSuggestionsOpen = false
  private checkGeneration = 0
  private typingPauseTimer: ReturnType<typeof setTimeout> | undefined
  private checkedSnapshot: EditableTextSnapshot | null = null
  private issues: SpellingIssue[] = []

  constructor(eventBus: SpellingEventBus, directEditing: DirectEditingService) {
    this.eventBus = eventBus
    this.textBox = directEditing._textbox
    if (!this.textBox) return

    eventBus.on('directEditing.activate', this.startChecking)
    eventBus.on(EDITING_ENDED_EVENTS, this.stopChecking)
    eventBus.on(CLOSE_SPELLING_SUGGESTIONS_EVENT, () => {
      this.areSuggestionsOpen = false
    })
  }

  private readonly startChecking = () => {
    const { content, parent } = this.textBox!
    this.stopChecking()
    this.isChecking = true
    content.lang = 'pt-BR'
    content.addEventListener('input', this.checkAfterTypingPause)
    content.addEventListener('click', this.offerSuggestionsAtCaret)
    parent.addEventListener('keydown', this.closeSuggestionsOnEscape, true)
    void this.checkSpelling()
  }

  private readonly stopChecking = () => {
    if (!this.isChecking) return
    const { content, parent } = this.textBox!
    this.isChecking = false
    content.removeEventListener('input', this.checkAfterTypingPause)
    content.removeEventListener('click', this.offerSuggestionsAtCaret)
    parent.removeEventListener('keydown', this.closeSuggestionsOnEscape, true)
    content.removeAttribute('spellcheck')
    this.forgetCheckedText()
    clearSpellingHighlights()
  }

  private forgetCheckedText() {
    clearTimeout(this.typingPauseTimer)
    this.checkGeneration++
    this.checkedSnapshot = null
    this.issues = []
    this.closeSuggestions()
  }

  private readonly checkAfterTypingPause = () => {
    this.forgetCheckedText()
    this.typingPauseTimer = setTimeout(
      () => void this.checkSpelling(),
      TYPING_PAUSE_BEFORE_LABEL_CHECK_MS,
    )
  }

  private async checkSpelling() {
    const { content } = this.textBox!
    const generation = ++this.checkGeneration
    const snapshot = readEditableText(content)
    const issues = await findSpellingIssues(snapshot.text)
    if (generation !== this.checkGeneration || !this.isChecking) return

    this.checkedSnapshot = snapshot
    this.issues = issues
    if (!isSpellingEngineUnavailable()) content.spellcheck = false
    paintSpellingHighlights(
      issues
        .map((issue) => rangeOfTextSpan(snapshot, issue.start, issue.end))
        .filter((range) => range !== null),
    )
  }

  private readonly offerSuggestionsAtCaret = () => {
    const snapshot = this.checkedSnapshot
    const caret = snapshot && caretOffsetIn(snapshot, window.getSelection())
    const issue = this.issues.find(
      ({ start, end }) => caret != null && caret >= start && caret <= end,
    )
    const range = issue && rangeOfTextSpan(snapshot!, issue.start, issue.end)
    if (!issue || !range) return this.closeSuggestions()

    const request: SpellingSuggestionRequest = {
      word: issue.word,
      anchor: range.getBoundingClientRect(),
      replaceWith: (suggestion) =>
        replaceRangeText(this.textBox!.content, range, suggestion),
    }
    this.areSuggestionsOpen = true
    this.eventBus.fire(OPEN_SPELLING_SUGGESTIONS_EVENT, request)
  }

  private closeSuggestions() {
    if (this.areSuggestionsOpen) {
      this.eventBus.fire(CLOSE_SPELLING_SUGGESTIONS_EVENT)
    }
  }

  private readonly closeSuggestionsOnEscape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !this.areSuggestionsOpen) return
    event.stopPropagation()
    event.preventDefault()
    this.closeSuggestions()
  }
}
