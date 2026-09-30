import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  caretOffsetIn,
  rangeOfTextSpan,
  readEditableText,
  replaceRangeText,
} from '@/components/editor/spelling/editable-text'

function makeEditable(html: string) {
  const root = document.createElement('div')
  root.innerHTML = html
  document.body.append(root)
  return root
}

describe('editable text', () => {
  afterEach(() => {
    document.body.replaceChildren()
    Reflect.deleteProperty(document, 'execCommand')
  })

  it('reads line breaks between text nodes as new lines', () => {
    expect(readEditableText(makeEditable('Analisar<br>pedido')).text).toBe(
      'Analisar\npedido',
    )
  })

  it('reads block elements as new lines', () => {
    expect(
      readEditableText(makeEditable('Analisar<div>pedido</div><div>hoje</div>'))
        .text,
    ).toBe('Analisar\npedido\nhoje')
  })

  it('finds the range of a word on a later line', () => {
    const snapshot = readEditableText(makeEditable('Analisar<br>proceso novo'))

    expect(rangeOfTextSpan(snapshot, 9, 16)?.toString()).toBe('proceso')
  })

  it('finds the range of a word split across two text nodes', () => {
    const root = makeEditable('')
    root.append('Novo pro', 'ceso')
    const snapshot = readEditableText(root)

    const range = rangeOfTextSpan(snapshot, 5, 12)

    expect(range?.toString()).toBe('proceso')
    expect(range?.startContainer).not.toBe(range?.endContainer)
  })

  it('finds no range outside the text', () => {
    const snapshot = readEditableText(makeEditable('fim'))

    expect(rangeOfTextSpan(snapshot, 10, 14)).toBeNull()
  })

  it('locates the caret counting the earlier lines', () => {
    const root = makeEditable('Analisar<br>proceso')
    const snapshot = readEditableText(root)
    const selection = window.getSelection()
    selection?.collapse(root.lastChild, 3)

    expect(caretOffsetIn(snapshot, selection)).toBe(12)
  })

  it('has no caret while a stretch of text is selected', () => {
    const root = makeEditable('proceso')
    const snapshot = readEditableText(root)
    const selection = window.getSelection()
    selection?.selectAllChildren(root)

    expect(caretOffsetIn(snapshot, selection)).toBeNull()
  })

  it('replaces the range as typed text so undo keeps working', () => {
    const execCommand = vi.fn(() => true)
    document.execCommand = execCommand
    const root = makeEditable('Novo proceso')
    const range = rangeOfTextSpan(readEditableText(root), 5, 12)!

    replaceRangeText(root, range, 'processo')

    expect(execCommand).toHaveBeenCalledWith('insertText', false, 'processo')
    expect(window.getSelection()?.toString()).toBe('proceso')
  })

  it('rewrites the text and announces the input when typing commands are missing', () => {
    const root = makeEditable('Novo proceso aqui')
    const announceInput = vi.fn()
    root.addEventListener('input', announceInput)
    const range = rangeOfTextSpan(readEditableText(root), 5, 12)!

    replaceRangeText(root, range, 'processo')

    expect(root.textContent).toBe('Novo processo aqui')
    expect(announceInput).toHaveBeenCalledTimes(1)
  })
})
