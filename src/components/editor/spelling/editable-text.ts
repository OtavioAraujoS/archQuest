interface TextPiece {
  node: Text
  start: number
}

export interface EditableTextSnapshot {
  text: string
  pieces: TextPiece[]
}

interface DocumentTypingCommands {
  execCommand?: (command: 'insertText', showUI: false, text: string) => boolean
}

const BLOCK_ELEMENT_NAMES = new Set(['DIV', 'P'])
const TEXT_NODE_TYPE = 3

function startsNewLine(element: Node, textSoFar: string) {
  if (element.nodeName === 'BR') return true
  return (
    BLOCK_ELEMENT_NAMES.has(element.nodeName) &&
    textSoFar.length > 0 &&
    !textSoFar.endsWith('\n')
  )
}

export function readEditableText(root: HTMLElement): EditableTextSnapshot {
  const pieces: TextPiece[] = []
  let text = ''
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
  )

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeType === TEXT_NODE_TYPE) {
      pieces.push({ node: node as Text, start: text.length })
      text += (node as Text).data
    } else if (startsNewLine(node, text)) {
      text += '\n'
    }
  }

  return { text, pieces }
}

function pieceHoldingCharacter(snapshot: EditableTextSnapshot, index: number) {
  return snapshot.pieces.find(
    ({ node, start }) => index >= start && index < start + node.length,
  )
}

export function rangeOfTextSpan(
  snapshot: EditableTextSnapshot,
  start: number,
  end: number,
) {
  const firstPiece = pieceHoldingCharacter(snapshot, start)
  const lastPiece = pieceHoldingCharacter(snapshot, end - 1)
  if (!firstPiece || !lastPiece) return null

  const range = document.createRange()
  range.setStart(firstPiece.node, start - firstPiece.start)
  range.setEnd(lastPiece.node, end - lastPiece.start)
  return range
}

export function caretOffsetIn(
  snapshot: EditableTextSnapshot,
  selection: Selection | null,
) {
  if (!selection?.isCollapsed) return null
  const caretPiece = snapshot.pieces.find(
    ({ node }) => node === selection.anchorNode,
  )
  return caretPiece ? caretPiece.start + selection.anchorOffset : null
}

function insertTextAsTyping(replacement: string) {
  const typingCommands: DocumentTypingCommands = document
  return typingCommands.execCommand?.('insertText', false, replacement) ?? false
}

export function replaceRangeText(
  root: HTMLElement,
  range: Range,
  replacement: string,
) {
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
  if (insertTextAsTyping(replacement)) return

  range.deleteContents()
  range.insertNode(document.createTextNode(replacement))
  range.collapse(false)
  root.dispatchEvent(new Event('input', { bubbles: true }))
}
