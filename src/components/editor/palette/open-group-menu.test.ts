import { describe, expect, it } from 'vitest'

import { GATEWAY_GROUP } from './groups/gateways'
import {
  menuPositionNextToClickedButton,
  openGroupMenu,
} from './open-group-menu'
import { createFakeDiagramServices } from './palette-test-setup'

function clickOnPaletteButton() {
  const paletteButton = document.createElement('div')
  paletteButton.className = 'entry'
  paletteButton.getBoundingClientRect = () =>
    ({ right: 50, top: 120 }) as DOMRect
  const clickEvent = new MouseEvent('click', { clientX: 30, clientY: 130 })
  Object.defineProperty(clickEvent, 'target', { value: paletteButton })
  return clickEvent
}

describe('menuPositionNextToClickedButton', () => {
  it('places the menu to the right of the clicked palette button', () => {
    expect(menuPositionNextToClickedButton(clickOnPaletteButton())).toEqual({
      x: 58,
      y: 120,
      cursor: { x: 30, y: 130 },
    })
  })

  it('falls back to the cursor position when there is no clicked element', () => {
    const clickEvent = new MouseEvent('click', { clientX: 10, clientY: 20 })

    expect(menuPositionNextToClickedButton(clickEvent)).toEqual({
      x: 18,
      y: 20,
      cursor: { x: 10, y: 20 },
    })
  })
})

describe('openGroupMenu', () => {
  it('opens the searchable group menu on the canvas root', () => {
    const { services } = createFakeDiagramServices()

    openGroupMenu(
      services.popupMenu,
      services.canvas,
      clickOnPaletteButton(),
      GATEWAY_GROUP,
    )

    expect(services.popupMenu.open).toHaveBeenCalledWith(
      { id: 'root' },
      'archquest-gateways',
      { x: 58, y: 120, cursor: { x: 30, y: 130 } },
      { title: 'Gateways', search: true },
    )
  })
})
