import { themedDefaultColors } from '@/lib/diagram-colors'
import type { Rgb } from '@/types/editor'

const MIN_SHAPE_CONTRAST = 3
const MIN_TEXT_CONTRAST = 4.5
const MIX_STEP = 0.1

function parseColor(color: string): Rgb | null {
  const rgb = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(color)
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
  const hex = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(color.trim())?.[1]
  if (!hex) return null
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex
  return [0, 2, 4].map((at) => parseInt(full.slice(at, at + 2), 16)) as Rgb
}

function luminance(rgb: Rgb) {
  const [r, g, b] = rgb.map((channel) => {
    const value = channel / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(first: Rgb, second: Rgb) {
  const [lighter, darker] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a,
  )
  return (lighter + 0.05) / (darker + 0.05)
}

function mix(color: Rgb, target: Rgb, amount: number): Rgb {
  return color.map((channel, i) =>
    Math.round(channel + (target[i] - channel) * amount),
  ) as Rgb
}

export function readableColor(
  color: string,
  background: string,
  ink: string,
  minContrast: number,
) {
  const rgb = parseColor(color)
  const backgroundRgb = parseColor(background)
  const inkRgb = parseColor(ink)
  if (!rgb || !backgroundRgb || !inkRgb) return null
  if (contrastRatio(rgb, backgroundRgb) >= minContrast) return null
  for (let amount = MIX_STEP; amount < 1; amount += MIX_STEP) {
    const mixed = mix(rgb, inkRgb, amount)
    if (contrastRatio(mixed, backgroundRgb) >= minContrast) {
      return `rgb(${mixed.join(', ')})`
    }
  }
  return `rgb(${inkRgb.join(', ')})`
}

export function makeColorsReadable(gfx: SVGElement, isDarkTheme: boolean) {
  const { fill: canvas, stroke: ink } = themedDefaultColors(isDarkTheme)
  const nodes = [...gfx.querySelectorAll<SVGElement>('*')]
  const strokeColors = new Set<string>()

  for (const node of nodes) {
    const stroke = node.style.getPropertyValue('stroke')
    const readable = readableColor(stroke, canvas, ink, MIN_SHAPE_CONTRAST)
    if (!readable) continue
    strokeColors.add(stroke)
    node.style.setProperty('stroke', readable)
  }

  for (const node of nodes) {
    const fill = node.style.getPropertyValue('fill')
    const isText = node.tagName.toLowerCase() === 'text'
    if (!isText && !strokeColors.has(fill)) continue
    const minContrast = isText ? MIN_TEXT_CONTRAST : MIN_SHAPE_CONTRAST
    const readable = readableColor(fill, canvas, ink, minContrast)
    if (readable) {
      node.style.setProperty(
        'fill',
        readable,
        node.style.getPropertyPriority('fill'),
      )
    }
  }
}
