import { describe, expect, it } from 'vitest'

import {
  readElementColors,
  toColorInputValue,
} from '@/components/editor/style/element-colors'

function shapeWithColors(colors: Record<string, string>) {
  return { di: { get: (name: string) => colors[name] } }
}

describe('toColorInputValue', () => {
  it('accepts six-digit hex and expands three-digit hex', () => {
    expect(toColorInputValue('#AABBCC', '#000000')).toBe('#aabbcc')
    expect(toColorInputValue('#abc', '#000000')).toBe('#aabbcc')
  })

  it('falls back for values a color input cannot show', () => {
    expect(toColorInputValue('var(--bpmn-shape-fill)', '#ffffff')).toBe(
      '#ffffff',
    )
    expect(toColorInputValue('rebeccapurple', '#0a0a0a')).toBe('#0a0a0a')
  })
})

describe('readElementColors', () => {
  it('shows the theme defaults for an uncolored shape', () => {
    expect(readElementColors(shapeWithColors({}), undefined, false)).toEqual({
      fill: '#ffffff',
      stroke: '#0a0a0a',
      text: '#0a0a0a',
    })
    expect(readElementColors(shapeWithColors({}), undefined, true)).toEqual({
      fill: '#14171e',
      stroke: '#fafafa',
      text: '#fafafa',
    })
  })

  it('shows the colors the user chose', () => {
    const shape = shapeWithColors({
      'color:background-color': '#ffcc00',
      'color:border-color': '#123456',
    })

    expect(readElementColors(shape, '#ff0000', true)).toEqual({
      fill: '#ffcc00',
      stroke: '#123456',
      text: '#ff0000',
    })
  })

  it('uses the defaults when the element has no diagram information', () => {
    expect(readElementColors({}, undefined, false).fill).toBe('#ffffff')
  })
})
