import { describe, expect, it } from 'vitest'

import GroupedPaletteProvider, {
  PRIORITY_AFTER_DEFAULT_PALETTE,
} from './GroupedPaletteProvider'
import { groupMenuId } from './group-menu-entries'
import { PALETTE_GROUP_CLASS } from './group-palette-entry'
import { PALETTE_GROUPS } from './groups'
import { setupGroupedPalette } from './palette-test-setup'

describe('GroupedPaletteProvider', () => {
  it('runs after the default palette and registers one popup menu per group', () => {
    const { services, registeredPopupMenus } = setupGroupedPalette()

    expect(services.palette.registerProvider).toHaveBeenCalledWith(
      PRIORITY_AFTER_DEFAULT_PALETTE,
      expect.any(GroupedPaletteProvider),
    )
    expect([...registeredPopupMenus.keys()]).toEqual(
      PALETTE_GROUPS.map(groupMenuId),
    )
  })

  it('turns the default gateway, task and sub-process buttons into groups', () => {
    const { paletteEntries } = setupGroupedPalette()

    for (const key of [
      'create.exclusive-gateway',
      'create.task',
      'create.subprocess-expanded',
    ]) {
      expect(paletteEntries[key].className).toContain(PALETTE_GROUP_CLASS)
    }
    expect(paletteEntries['archquest.events'].group).toBe('event')
    expect(paletteEntries['create.data-object']).toEqual({ group: 'data-object' })
  })

  it('opens the group menu when a group button is clicked', () => {
    const { services, paletteEntries } = setupGroupedPalette()

    paletteEntries['create.task'].action.click(new MouseEvent('click'))

    expect(services.popupMenu.open).toHaveBeenCalledWith(
      { id: 'root' },
      'archquest-tasks',
      expect.any(Object),
      expect.objectContaining({ title: 'Tarefas' }),
    )
  })

  it('creates the first variant when a group button is dragged', () => {
    const { services, paletteEntries } = setupGroupedPalette()
    const dragEvent = new MouseEvent('dragstart')

    paletteEntries['create.exclusive-gateway'].action.dragstart(dragEvent)

    expect(services.create.start).toHaveBeenCalledWith(dragEvent, {
      type: 'bpmn:ExclusiveGateway',
    })
  })
})
