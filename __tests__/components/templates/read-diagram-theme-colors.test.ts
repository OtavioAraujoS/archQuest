import { afterEach, describe, expect, it } from 'vitest'

import { readDiagramThemeColors } from '@/components/templates/read-diagram-theme-colors'

describe('readDiagramThemeColors', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('style')
  })

  it('paints shapes with the card surface and strokes and labels with the foreground', () => {
    document.documentElement.style.setProperty('--card', 'oklch(0.205 0.015 264)')
    document.documentElement.style.setProperty('--foreground', 'oklch(0.985 0 0)')

    expect(readDiagramThemeColors(document.documentElement)).toEqual({
      defaultFillColor: 'oklch(0.205 0.015 264)',
      defaultStrokeColor: 'oklch(0.985 0 0)',
      defaultLabelColor: 'oklch(0.985 0 0)',
    })
  })
})
