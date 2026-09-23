import { describe, expect, it } from 'vitest'

import type { TypeOfGateway } from '@/types/pallete'

import { variantMenuEntryKey } from '@/components/editor/palette/group-menu-entries'
import { PALETTE_GROUPS } from '@/components/editor/palette/groups/index'
import { GATEWAY_GROUP } from '@/components/editor/palette/groups/gateways'
import { setupGroupedPalette } from './palette-test-setup'

const VARIANTS_WITHOUT_INNER_START_EVENT = PALETTE_GROUPS.flatMap((group) =>
  group.variants
    .filter((variant) => !variant.withStartEvent)
    .map((variant) => ({ group, variant })),
)

describe('group menu entries', () => {
  it.each(VARIANTS_WITHOUT_INNER_START_EVENT)(
    'creates $variant.label from the $group.id menu on click and drag',
    ({ group, variant }) => {
      const { services, getGroupMenuEntries } = setupGroupedPalette()
      const menuEntry =
        getGroupMenuEntries(group)[variantMenuEntryKey(group, variant)]
      const clickEvent = new MouseEvent('click')

      menuEntry.action.click(clickEvent)
      menuEntry.action.dragstart(clickEvent)

      expect(menuEntry.label).toBe(variant.label)
      expect(services.create.start).toHaveBeenCalledTimes(2)
      expect(services.create.start).toHaveBeenCalledWith(
        clickEvent,
        variant.attrs,
      )
      expect(services.popupMenu.close).toHaveBeenCalledTimes(2)
    },
  )

  it('offers all five gateway types', () => {
    const { getGroupMenuEntries } = setupGroupedPalette()
    const expectedGatewayLabels: TypeOfGateway[] = [
      'Exclusivo',
      'Paralelo',
      'Inclusivo',
      'Baseado em eventos',
      'Complexo',
    ]

    const gatewayLabels = Object.values(getGroupMenuEntries(GATEWAY_GROUP)).map(
      (menuEntry) => menuEntry.label,
    )

    expect(gatewayLabels).toEqual(expectedGatewayLabels)
  })
})
