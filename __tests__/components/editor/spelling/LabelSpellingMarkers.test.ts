import { beforeEach, describe, expect, it, vi } from 'vitest'

import LabelSpellingMarkers from '@/components/editor/spelling/LabelSpellingMarkers'
import type { LabeledElement } from '@/types/spelling'

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

async function importDiagram(elements: LabeledElement[]) {
  const eventBus = createSpellingEventBus()
  const overlays = createFakeOverlays()
  const directEditing = { activate: vi.fn(() => true) }
  new LabelSpellingMarkers(
    eventBus,
    overlays,
    createFakeElementRegistry(elements),
    directEditing,
  )
  eventBus.fire('import.done')
  await allChecksToSettle()
  return { eventBus, overlays, directEditing }
}

function badgesOf(overlays: ReturnType<typeof createFakeOverlays>) {
  return [...overlays.addedOverlays.values()]
}

describe('LabelSpellingMarkers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    spellingClient.forgetMisspellings()
    spellingClient.treatAsMisspelled('proceso', ['processo'])
  })

  it('marks only the imported elements with a misspelled label', async () => {
    const misspelledTask = makeLabeledTask('Task_1', 'Iniciar proceso')
    const correctTask = makeLabeledTask('Task_2', 'Iniciar processo')

    const { overlays } = await importDiagram([misspelledTask, correctTask])

    expect(badgesOf(overlays)).toHaveLength(1)
    expect(badgesOf(overlays)[0].element).toBe(misspelledTask)
    expect(badgesOf(overlays)[0].overlay.html.title).toBe(
      'Possível erro de ortografia: proceso',
    )
  })

  it('anchors the badge on the external label when there is one', async () => {
    const gateway = makeLabeledTask('Gateway_1', 'proceso aprovado?')
    const externalLabel = { id: 'Gateway_1_label', labelTarget: gateway }
    gateway.label = externalLabel

    const { overlays } = await importDiagram([gateway, externalLabel])

    expect(badgesOf(overlays)).toHaveLength(1)
    expect(badgesOf(overlays)[0].element).toBe(externalLabel)
  })

  it('ignores the diagram root', async () => {
    const root = {
      ...makeLabeledTask('Process_1', 'proceso'),
      parent: undefined,
    }

    const { overlays } = await importDiagram([root])

    expect(overlays.add).not.toHaveBeenCalled()
  })

  it('removes the badge once the label is corrected', async () => {
    const task = makeLabeledTask('Task_1', 'Iniciar proceso')
    const { eventBus, overlays } = await importDiagram([task])

    renameLabeledElement(task, 'Iniciar processo')
    eventBus.fire('elements.changed', { elements: [task] })
    await allChecksToSettle()

    expect(badgesOf(overlays)).toHaveLength(0)
  })

  it('keeps the same badge while the label text stays the same', async () => {
    const task = makeLabeledTask('Task_1', 'Iniciar proceso')
    const { eventBus, overlays } = await importDiagram([task])

    eventBus.fire('elements.changed', { elements: [task] })
    await allChecksToSettle()

    expect(overlays.add).toHaveBeenCalledTimes(1)
    expect(overlays.remove).not.toHaveBeenCalled()
  })

  it('opens the label for editing when the badge is clicked', async () => {
    const task = makeLabeledTask('Task_1', 'Iniciar proceso')
    const { overlays, directEditing } = await importDiagram([task])

    badgesOf(overlays)[0].overlay.html.click()

    expect(directEditing.activate).toHaveBeenCalledWith(task)
  })

  it('hides the badge during editing and checks the label again afterwards', async () => {
    const task = makeLabeledTask('Task_1', 'Iniciar proceso')
    const { eventBus, overlays } = await importDiagram([task])

    eventBus.fire('directEditing.activate', { active: { element: task } })
    eventBus.fire('elements.changed', { elements: [task] })
    await allChecksToSettle()
    expect(badgesOf(overlays)).toHaveLength(0)

    eventBus.fire('directEditing.deactivate', { active: null })
    await allChecksToSettle()
    expect(badgesOf(overlays)).toHaveLength(1)
  })

  it('marks the element again when its removal is undone', async () => {
    const task = makeLabeledTask('Task_1', 'Iniciar proceso')
    const { eventBus, overlays } = await importDiagram([task])

    eventBus.fire('shape.remove', { element: task })
    eventBus.fire('elements.changed', { elements: [task] })
    await allChecksToSettle()

    expect(overlays.add).toHaveBeenCalledTimes(2)
  })
})
