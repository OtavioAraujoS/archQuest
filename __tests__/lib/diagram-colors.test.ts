import { describe, expect, it, vi } from 'vitest'

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

  it('exports colors chosen on the dark canvas readable on white paper', () => {
    const exportedSvg = resolveThemedColorsForExport(
      '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<svg xmlns="http://www.w3.org/2000/svg"><g class="djs-visual">' +
        '<circle style="stroke: rgb(255, 255, 255)"/>' +
        '<rect data-original-stroke="rgb(0, 0, 0)" style="stroke: rgb(133, 133, 133)"/>' +
        '</g></svg>',
    )

    expect(
      exportedSvg.startsWith('<?xml version="1.0" encoding="utf-8"?>'),
    ).toBe(true)
    expect(exportedSvg).not.toContain('stroke: rgb(255, 255, 255)')
    expect(exportedSvg).toContain('stroke: rgb(0, 0, 0)')
    expect(exportedSvg).not.toContain('data-original-')
  })

  it('keeps a single XML declaration when the browser serializer writes one', () => {
    const serialize = XMLSerializer.prototype.serializeToString
    const spy = vi
      .spyOn(XMLSerializer.prototype, 'serializeToString')
      .mockImplementation(function (this: XMLSerializer, node: Node) {
        return (
          '<?xml version="1.0" encoding="utf-8"?>' + serialize.call(this, node)
        )
      })

    const exportedSvg = resolveThemedColorsForExport(
      '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<svg xmlns="http://www.w3.org/2000/svg"><g class="djs-visual">' +
        '<circle style="stroke: rgb(255, 255, 255)"/></g></svg>',
    )
    spy.mockRestore()

    expect(exportedSvg.match(/<\?xml/g)).toHaveLength(1)
    const parsed = new DOMParser().parseFromString(exportedSvg, 'image/svg+xml')
    expect(parsed.querySelector('parsererror')).toBeNull()
  })

  it('offers the default shape colors of each theme', () => {
    expect(themedDefaultColors(false)).toBe(LIGHT_PAPER_COLORS)
    expect(themedDefaultColors(true)).toBe(DARK_CANVAS_COLORS)
  })
})
