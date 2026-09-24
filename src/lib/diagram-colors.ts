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

export function resolveThemedColorsForExport(svg: string) {
  return svg
    .replaceAll(SHAPE_FILL_VARIABLE, LIGHT_PAPER_COLORS.fill)
    .replaceAll(SHAPE_STROKE_VARIABLE, LIGHT_PAPER_COLORS.stroke)
}
