import { describe, expect, it } from 'vitest'

import {
  placeElementMenu,
  unionOfRects,
} from '@/components/editor/element-menu/place-element-menu'

const CANVAS = { width: 1000, height: 600 }
const MENU = { width: 288, height: 200 }

describe('placeElementMenu', () => {
  it('centers the menu above the element when it fits', () => {
    expect(
      placeElementMenu(
        { left: 400, top: 300, width: 100, height: 80 },
        MENU,
        CANVAS,
      ),
    ).toEqual({ top: 92, left: 306, placement: 'above' })
  })

  it('opens below an element near the top of the canvas', () => {
    expect(
      placeElementMenu(
        { left: 400, top: 40, width: 100, height: 80 },
        MENU,
        CANVAS,
      ),
    ).toMatchObject({ top: 128, placement: 'below' })
  })

  it('stays inside the canvas edges', () => {
    const placement = placeElementMenu(
      { left: 950, top: 400, width: 40, height: 40 },
      MENU,
      CANVAS,
    )

    expect(placement.left).toBe(CANVAS.width - MENU.width - 8)
  })
})

describe('unionOfRects', () => {
  it('surrounds every selected element, relative to the canvas', () => {
    expect(
      unionOfRects(
        [
          { left: 110, top: 120, width: 50, height: 50 },
          { left: 200, top: 100, width: 40, height: 30 },
        ],
        { left: 100, top: 100 },
      ),
    ).toEqual({ left: 10, top: 0, width: 130, height: 70 })
  })
})
