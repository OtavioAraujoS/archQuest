import { getLabel } from 'bpmn-js/lib/util/LabelUtil'

import { findSpellingIssues } from '@/lib/spelling/find-spelling-issues'

import { badgePositionFor, createSpellingBadge } from './spelling-badge'
import type {
  ChangedElementsEvent,
  DirectEditingEvent,
  DirectEditingService,
  LabeledElement,
  LabeledElementRegistry,
  OverlaysService,
  RemovedElementEvent,
  SpellingEventBus,
} from './spelling-services'

export const SPELLING_OVERLAY_TYPE = 'archquest-spelling'

const SMALLEST_ZOOM_SHOWING_BADGES = 0.4
const BADGE_SCALE_LIMITS = { min: 0.75, max: 1.25 }

interface CheckedLabel {
  text: string
  overlayId?: string
}

function labelOwnerOf(element: LabeledElement) {
  return element.labelTarget ?? element
}

function labelTextOf(labelOwner: LabeledElement) {
  if (!labelOwner.businessObject || !labelOwner.parent) return ''
  return getLabel(labelOwner as Parameters<typeof getLabel>[0]) ?? ''
}

export default class LabelSpellingMarkers {
  static readonly $inject = [
    'eventBus',
    'overlays',
    'elementRegistry',
    'directEditing',
  ]

  private readonly overlays: OverlaysService
  private readonly elementRegistry: LabeledElementRegistry
  private readonly directEditing: DirectEditingService
  private readonly checkedLabels = new Map<string, CheckedLabel>()
  private labelOwnerBeingEdited: LabeledElement | null = null

  constructor(
    eventBus: SpellingEventBus,
    overlays: OverlaysService,
    elementRegistry: LabeledElementRegistry,
    directEditing: DirectEditingService,
  ) {
    this.overlays = overlays
    this.elementRegistry = elementRegistry
    this.directEditing = directEditing

    eventBus.on('import.done', this.checkEveryLabel)
    eventBus.on('elements.changed', this.checkChangedLabels)
    eventBus.on(['shape.remove', 'connection.remove'], this.forgetRemovedLabel)
    eventBus.on('diagram.clear', () => this.checkedLabels.clear())
    eventBus.on('directEditing.activate', this.hideBadgeWhileEditing)
    eventBus.on('directEditing.deactivate', this.checkEditedLabel)
  }

  private readonly checkEveryLabel = () => {
    this.elementRegistry
      .filter((element) => !element.labelTarget)
      .forEach((labelOwner) => void this.checkLabel(labelOwner))
  }

  private readonly checkChangedLabels = ({ elements }: ChangedElementsEvent) => {
    new Set(elements.map(labelOwnerOf)).forEach(
      (labelOwner) => void this.checkLabel(labelOwner),
    )
  }

  private readonly forgetRemovedLabel = ({ element }: RemovedElementEvent) => {
    this.forgetLabel(labelOwnerOf(element))
  }

  private readonly hideBadgeWhileEditing = ({ active }: DirectEditingEvent) => {
    if (!active) return
    this.labelOwnerBeingEdited = labelOwnerOf(active.element)
    this.forgetLabel(this.labelOwnerBeingEdited)
  }

  private readonly checkEditedLabel = () => {
    const editedLabelOwner = this.labelOwnerBeingEdited
    this.labelOwnerBeingEdited = null
    if (editedLabelOwner) void this.checkLabel(editedLabelOwner)
  }

  private forgetLabel(labelOwner: LabeledElement) {
    const overlayId = this.checkedLabels.get(labelOwner.id)?.overlayId
    if (overlayId) this.overlays.remove(overlayId)
    this.checkedLabels.delete(labelOwner.id)
  }

  private async checkLabel(labelOwner: LabeledElement) {
    if (labelOwner === this.labelOwnerBeingEdited) return
    const text = labelTextOf(labelOwner)
    if (this.checkedLabels.get(labelOwner.id)?.text === text) return

    this.forgetLabel(labelOwner)
    const checkedLabel: CheckedLabel = { text }
    this.checkedLabels.set(labelOwner.id, checkedLabel)
    const issues = await findSpellingIssues(text)

    const isStillCurrent =
      this.checkedLabels.get(labelOwner.id) === checkedLabel &&
      this.elementRegistry.get(labelOwner.id) === labelOwner
    if (!isStillCurrent || issues.length === 0) return

    checkedLabel.overlayId = this.overlays.add(
      labelOwner.label ?? labelOwner,
      SPELLING_OVERLAY_TYPE,
      {
        position: badgePositionFor(labelOwner),
        html: createSpellingBadge(
          issues.map((issue) => issue.word),
          () => this.directEditing.activate(labelOwner),
        ),
        show: { minZoom: SMALLEST_ZOOM_SHOWING_BADGES },
        scale: BADGE_SCALE_LIMITS,
      },
    )
  }
}
