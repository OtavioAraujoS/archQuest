import { makeColorsReadable } from '@/lib/bpmn/readable-colors'

const SHAPE_FILL_VARIABLE = 'var(--bpmn-shape-fill)'
const SHAPE_STROKE_VARIABLE = 'var(--bpmn-shape-stroke)'

export const THEMED_DIAGRAM_RENDERER_COLORS = {
  defaultFillColor: SHAPE_FILL_VARIABLE,
  defaultStrokeColor: SHAPE_STROKE_VARIABLE,
  defaultLabelColor: SHAPE_STROKE_VARIABLE,
}

export const LIGHT_PAPER_COLORS = { fill: '#ffffff', stroke: '#0a0a0a' }
export const DARK_CANVAS_COLORS = { fill: '#14171e', stroke: '#fafafa' }

export function themedDefaultColors(isDarkTheme: boolean) {
  return isDarkTheme ? DARK_CANVAS_COLORS : LIGHT_PAPER_COLORS
}

const XML_PROLOG = /^\s*<\?xml[^>]*>\s*/
const ORIGINAL_COLOR_ATTRIBUTES = ['data-original-stroke', 'data-original-fill']

function makeColorsReadableOnPaper(svg: string) {
  if (!svg.includes('djs-visual')) return svg
  const svgDocument = new DOMParser().parseFromString(svg, 'image/svg+xml')
  if (svgDocument.querySelector('parsererror')) return svg

  svgDocument
    .querySelectorAll('.djs-visual')
    .forEach((visual) => makeColorsReadable(visual, LIGHT_PAPER_COLORS))
  svgDocument
    .querySelectorAll('[data-original-stroke], [data-original-fill]')
    .forEach((node) =>
      ORIGINAL_COLOR_ATTRIBUTES.forEach((name) => node.removeAttribute(name)),
    )
  const serialized = new XMLSerializer().serializeToString(svgDocument)
  if (XML_PROLOG.test(serialized)) return serialized
  return (XML_PROLOG.exec(svg)?.[0] ?? '') + serialized
}

export function resolveThemedColorsForExport(svg: string) {
  return makeColorsReadableOnPaper(svg)
    .replaceAll(SHAPE_FILL_VARIABLE, LIGHT_PAPER_COLORS.fill)
    .replaceAll(SHAPE_STROKE_VARIABLE, LIGHT_PAPER_COLORS.stroke)
}
