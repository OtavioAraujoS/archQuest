import { describe, expect, it } from 'vitest'

import { contrastRatio, makeColorsReadable } from '@/lib/bpmn/readable-colors'
import { DARK_CANVAS_COLORS, LIGHT_PAPER_COLORS } from '@/lib/diagram-colors'
import type { Rgb } from '@/types/editor'

const DEFAULT_TEXT = 'fill: var(--bpmn-shape-stroke)'

function drawnTask(bodyFill: string, textStyle = DEFAULT_TEXT) {
  const gfx = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  gfx.innerHTML = `
    <rect style="stroke: var(--bpmn-shape-stroke); fill: ${bodyFill}" />
    <text style="${textStyle}">Validar PIN</text>`
  return gfx
}

function bodyFillOf(gfx: SVGElement) {
  return gfx.querySelector('rect')!.style.getPropertyValue('fill')
}

function rgbOf(color: string) {
  return color.match(/\d+/g)!.map(Number) as Rgb
}

describe('makeColorsReadable on filled shapes', () => {
  it('dims a white task fill on the dark theme so its light text shows', () => {
    const gfx = drawnTask('rgb(255, 255, 255)')

    makeColorsReadable(gfx, DARK_CANVAS_COLORS)

    expect(
      contrastRatio(rgbOf(bodyFillOf(gfx)), [250, 250, 250]),
    ).toBeGreaterThanOrEqual(4.5)
  })

  it('brightens a dark task fill on the light theme so its dark text shows', () => {
    const gfx = drawnTask('rgb(20, 23, 30)')

    makeColorsReadable(gfx, LIGHT_PAPER_COLORS)

    expect(
      contrastRatio(rgbOf(bodyFillOf(gfx)), [10, 10, 10]),
    ).toBeGreaterThanOrEqual(4.5)
  })

  it('brings the chosen fill back when the other theme can read it', () => {
    const gfx = drawnTask('rgb(255, 255, 255)')

    makeColorsReadable(gfx, DARK_CANVAS_COLORS)
    makeColorsReadable(gfx, LIGHT_PAPER_COLORS)

    expect(bodyFillOf(gfx)).toBe('rgb(255, 255, 255)')
  })

  it('leaves the fill of a shape without text inside untouched', () => {
    const gfx = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    gfx.innerHTML = `<circle style="stroke: var(--bpmn-shape-stroke); fill: rgb(255, 255, 255)" />`

    makeColorsReadable(gfx, DARK_CANVAS_COLORS)

    expect(gfx.querySelector('circle')!.style.getPropertyValue('fill')).toBe(
      'rgb(255, 255, 255)',
    )
  })
})
