import { beforeEach, describe, expect, it, vi } from 'vitest'

import LabelSpellingMarkers from '@/components/editor/spelling/LabelSpellingMarkers'
import { SPELLING_ISSUES_CHANGED_EVENT } from '@/components/editor/spelling/spelling-events'

import {
  createFakeElementRegistry,
  createFakeOverlays,
  createSpellingEventBus,
  makeLabeledTask,
  renameLabeledElement,
} from './spelling-module-fakes'

const spellingClient = await vi.hoisted(async () => {
  const { createFakeSpellingClient } =
    await import('../../spelling/fake-spelling-client')
  return createFakeSpellingClient()
})

vi.mock('@/lib/spelling/spelling-client', () => spellingClient)

const allChecksToSettle = () => new Promise((resolve) => setTimeout(resolve))

describe('LabelSpellingMarkers issues list', () => {
  beforeEach(() => {
    spellingClient.forgetMisspellings()
    spellingClient.treatAsMisspelled('proceso', ['processo'])
  })

  it('keeps the misspelled words of each label and announces changes', async () => {
    const task = makeLabeledTask('Task_1', 'Revisar proceso')
    const eventBus = createSpellingEventBus()
    const markers = new LabelSpellingMarkers(
      eventBus,
      createFakeOverlays(),
      createFakeElementRegistry([task, makeLabeledTask('Task_2', 'Aprovar')]),
      { activate: vi.fn(() => true) },
    )

    eventBus.fire('import.done')
    await allChecksToSettle()

    expect(markers.checkedLabels.get('Task_1')?.words).toEqual(['proceso'])
    expect(markers.checkedLabels.get('Task_2')?.words).toBeUndefined()
    expect(eventBus.fire).toHaveBeenCalledWith(SPELLING_ISSUES_CHANGED_EVENT)

    renameLabeledElement(task, 'Revisar processo')
    eventBus.fire('elements.changed', { elements: [task] })
    await allChecksToSettle()

    expect(markers.checkedLabels.get('Task_1')?.words).toBeUndefined()
  })
})
