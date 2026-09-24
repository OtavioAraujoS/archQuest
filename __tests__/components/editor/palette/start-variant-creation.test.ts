import { describe, expect, it } from 'vitest'

import { SUBPROCESS_GROUP } from '@/components/editor/palette/groups/subprocesses'
import { createFakeDiagramServices } from './palette-test-setup'
import { startVariantCreation } from '@/components/editor/palette/start-variant-creation'

const [EXPANDED_SUBPROCESS, COLLAPSED_SUBPROCESS] = SUBPROCESS_GROUP.variants

describe('startVariantCreation', () => {
  it('closes the menu and starts creating a single shape', () => {
    const { services } = createFakeDiagramServices()
    const clickEvent = new MouseEvent('click')

    startVariantCreation(services, clickEvent, COLLAPSED_SUBPROCESS)

    expect(services.popupMenu.close).toHaveBeenCalledOnce()
    expect(services.create.start).toHaveBeenCalledWith(clickEvent, {
      type: 'bpmn:SubProcess',
      isExpanded: false,
    })
  })

  it('creates expanded sub-processes with a start event inside', () => {
    const { services } = createFakeDiagramServices()
    const clickEvent = new MouseEvent('click')

    startVariantCreation(services, clickEvent, EXPANDED_SUBPROCESS)

    const subProcess = { type: 'bpmn:SubProcess', isExpanded: true }
    expect(services.create.start).toHaveBeenCalledWith(
      clickEvent,
      [
        subProcess,
        { type: 'bpmn:StartEvent', x: 40, y: 82, parent: subProcess },
      ],
      { hints: { autoSelect: [subProcess] } },
    )
  })
})
