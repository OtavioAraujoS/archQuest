import type { LabeledElement, OverlayPosition } from './spelling-services'

export const SPELLING_BADGE_CLASS = 'archquest-spelling-badge'

const BADGE_OVERHANG = 10
const ELEMENT_TYPES_LABELED_ON_THE_LEFT = new Set([
  'bpmn:Participant',
  'bpmn:Lane',
])

export function createSpellingBadge(
  misspelledWords: string[],
  onActivate: () => void,
) {
  const description = `Possível erro de ortografia: ${misspelledWords.join(', ')}`
  const badge = document.createElement('button')
  badge.type = 'button'
  badge.className = SPELLING_BADGE_CLASS
  badge.textContent = 'abc'
  badge.title = description
  badge.setAttribute('aria-label', description)
  badge.addEventListener('click', onActivate)
  return badge
}

export function badgePositionFor(labelOwner: LabeledElement): OverlayPosition {
  const isLabeledOnTheLeft = ELEMENT_TYPES_LABELED_ON_THE_LEFT.has(
    labelOwner.type ?? '',
  )
  return isLabeledOnTheLeft
    ? { top: -BADGE_OVERHANG, left: -BADGE_OVERHANG }
    : { top: -BADGE_OVERHANG, right: BADGE_OVERHANG }
}
