import type { CanvasColors, Rgb } from '@/types/editor'

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

function originalColor(node: SVGElement, property: 'stroke' | 'fill') {
  return (
    node.getAttribute(`data-original-${property}`) ??
    node.style.getPropertyValue(property)
  )
}

function paintReadable(
  node: SVGElement,
  property: 'stroke' | 'fill',
  readable: string | null,
) {
  const original = originalColor(node, property)
  const priority = node.style.getPropertyPriority(property)
  if (readable) node.setAttribute(`data-original-${property}`, original)
  else node.removeAttribute(`data-original-${property}`)
  node.style.setProperty(property, readable ?? original, priority)
}

export function makeColorsReadable(
  gfx: Element,
  { fill: canvas, stroke: ink }: CanvasColors,
) {
  const nodes = [...gfx.querySelectorAll<SVGElement>('*')]
  const strokeColors = new Set<string>()

  for (const node of nodes) {
    const stroke = originalColor(node, 'stroke')
    const readable = readableColor(stroke, canvas, ink, MIN_SHAPE_CONTRAST)
    if (readable) strokeColors.add(stroke)
    if (readable || node.hasAttribute('data-original-stroke')) {
      paintReadable(node, 'stroke', readable)
    }
  }

  const isText = (node: SVGElement) => node.tagName.toLowerCase() === 'text'
  const isOutlineColored = (node: SVGElement) =>
    isText(node) || strokeColors.has(originalColor(node, 'fill'))

  for (const node of nodes.filter(isOutlineColored)) {
    const minContrast = isText(node) ? MIN_TEXT_CONTRAST : MIN_SHAPE_CONTRAST
    const readable = readableColor(
      originalColor(node, 'fill'),
      canvas,
      ink,
      minContrast,
    )
    if (readable || node.hasAttribute('data-original-fill')) {
      paintReadable(node, 'fill', readable)
    }
  }

  const label = nodes.find(isText)
  const labelColor = label?.style.getPropertyValue('fill')
  const textColor = labelColor?.startsWith('var(') ? ink : labelColor
  for (const node of nodes.filter((node) => !isOutlineColored(node))) {
    const readable = textColor
      ? readableColor(
          originalColor(node, 'fill'),
          textColor,
          canvas,
          MIN_TEXT_CONTRAST,
        )
      : null
    if (readable || node.hasAttribute('data-original-fill')) {
      paintReadable(node, 'fill', readable)
    }
  }
}
