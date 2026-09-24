import { describe, expect, it } from 'vitest'

import {
  DARK_CANVAS_COLORS,
  LIGHT_PAPER_COLORS,
  resolveThemedColorsForExport,
  THEMED_DIAGRAM_RENDERER_COLORS,
  themedDefaultColors,
} from '@/lib/diagram-colors'

describe('diagram colors', () => {
  it('lets the renderer paint shapes with the theme variables', () => {
    expect(THEMED_DIAGRAM_RENDERER_COLORS).toEqual({
      defaultFillColor: 'var(--bpmn-shape-fill)',
      defaultStrokeColor: 'var(--bpmn-shape-stroke)',
      defaultLabelColor: 'var(--bpmn-shape-stroke)',
    })
  })

  it('exports every themed color as the light paper palette', () => {
    const renderedSvg =
      '<rect style="fill: var(--bpmn-shape-fill); stroke: var(--bpmn-shape-stroke)"/>' +
      '<text style="fill: var(--bpmn-shape-stroke)"/>'

    expect(resolveThemedColorsForExport(renderedSvg)).toBe(
      '<rect style="fill: #ffffff; stroke: #0a0a0a"/>' +
        '<text style="fill: #0a0a0a"/>',
    )
  })

  it('keeps colors chosen by the user untouched', () => {
    const renderedSvg = '<rect style="fill: #ffcc00"/>'

    expect(resolveThemedColorsForExport(renderedSvg)).toBe(renderedSvg)
  })

  it('offers the default shape colors of each theme', () => {
    expect(themedDefaultColors(false)).toBe(LIGHT_PAPER_COLORS)
    expect(themedDefaultColors(true)).toBe(DARK_CANVAS_COLORS)
  })
})
