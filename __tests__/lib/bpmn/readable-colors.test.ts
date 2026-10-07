import { describe, expect, it } from 'vitest'

import {
  contrastRatio,
  makeColorsReadable,
  readableColor,
} from '@/lib/bpmn/readable-colors'
import { DARK_CANVAS_COLORS, LIGHT_PAPER_COLORS } from '@/lib/diagram-colors'
import type { Rgb } from '@/types/editor'

const WHITE_PAPER = '#ffffff'
const BLACK_INK = '#0a0a0a'

function rgbOf(color: string) {
  return color.match(/\d+/g)!.map(Number) as Rgb
}

function drawnElement(markup: string) {
  const gfx = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  gfx.innerHTML = markup
  return gfx
}

function styleOf(gfx: SVGElement, selector: string, property: string) {
  return gfx
    .querySelector<SVGElement>(selector)!
    .style.getPropertyValue(property)
}

describe('readableColor', () => {
  it('darkens a white stroke on the light canvas', () => {
    const readable = readableColor(
      'rgb(255, 255, 255)',
      WHITE_PAPER,
      BLACK_INK,
      3,
    )

    expect(
      contrastRatio(rgbOf(readable!), [255, 255, 255]),
    ).toBeGreaterThanOrEqual(3)
  })

  it('keeps the hue of a neon yellow while darkening it', () => {
    const [red, green, blue] = rgbOf(
      readableColor('#ffff00', WHITE_PAPER, BLACK_INK, 3)!,
    )

    expect(red).toBe(green)
    expect(red).toBeGreaterThan(blue)
    expect(
      contrastRatio([red, green, blue], [255, 255, 255]),
    ).toBeGreaterThanOrEqual(3)
  })

  it('leaves colors that already stand out and theme variables untouched', () => {
    expect(
      readableColor('rgb(255, 0, 0)', WHITE_PAPER, BLACK_INK, 3),
    ).toBeNull()
    expect(
      readableColor('var(--bpmn-shape-stroke)', WHITE_PAPER, BLACK_INK, 3),
    ).toBeNull()
  })
})

describe('makeColorsReadable', () => {
  it('fixes a white event outline and its icon on the light theme', () => {
    const gfx = drawnElement(`
      <circle class="outline" style="stroke: rgb(255, 255, 255); fill: rgb(255, 255, 255)" />
      <path class="icon" style="fill: rgb(255, 255, 255); stroke: var(--bpmn-shape-fill)" />`)

    makeColorsReadable(gfx, LIGHT_PAPER_COLORS)

    expect(styleOf(gfx, '.outline', 'stroke')).not.toBe('rgb(255, 255, 255)')
    expect(styleOf(gfx, '.icon', 'fill')).toBe(
      styleOf(gfx, '.outline', 'stroke'),
    )
  })

  it('keeps a light shape fill that is not an outline color', () => {
    const gfx = drawnElement(
      `<rect style="stroke: rgb(255, 0, 0); fill: rgb(255, 255, 255)" />`,
    )

    makeColorsReadable(gfx, LIGHT_PAPER_COLORS)

    expect(styleOf(gfx, 'rect', 'fill')).toBe('rgb(255, 255, 255)')
  })

  it('lightens a black outline on the dark theme', () => {
    const gfx = drawnElement(`<rect style="stroke: rgb(0, 0, 0)" />`)

    makeColorsReadable(gfx, DARK_CANVAS_COLORS)

    expect(styleOf(gfx, 'rect', 'stroke')).not.toBe('rgb(0, 0, 0)')
  })

  it('keeps the custom text color priority when fixing it', () => {
    const gfx = drawnElement(
      `<text style="fill: #ffffff !important">Evento</text>`,
    )

    makeColorsReadable(gfx, LIGHT_PAPER_COLORS)

    const text = gfx.querySelector<SVGElement>('text')!
    expect(text.style.getPropertyValue('fill')).not.toBe('#ffffff')
    expect(text.style.getPropertyPriority('fill')).toBe('important')
  })

  it('brings the chosen color back when the theme no longer needs a fix', () => {
    const gfx = drawnElement(`<rect style="stroke: rgb(0, 0, 0)" />`)

    makeColorsReadable(gfx, DARK_CANVAS_COLORS)
    makeColorsReadable(gfx, LIGHT_PAPER_COLORS)

    expect(styleOf(gfx, 'rect', 'stroke')).toBe('rgb(0, 0, 0)')
    expect(
      gfx.querySelector('rect')!.hasAttribute('data-original-stroke'),
    ).toBe(false)
  })
})
