import { getFillColor, getStrokeColor } from 'bpmn-js/lib/draw/BpmnRenderUtil'

import { themedDefaultColors } from '@/lib/diagram-colors'

const SIX_DIGIT_HEX = /^#[\da-f]{6}$/i
const THREE_DIGIT_HEX = /^#([\da-f])([\da-f])([\da-f])$/i

export function toColorInputValue(color: string, fallback: string) {
  if (SIX_DIGIT_HEX.test(color)) return color.toLowerCase()
  const shortHex = THREE_DIGIT_HEX.exec(color)
  if (!shortHex) return fallback
  const [, red, green, blue] = shortHex
  return `#${red}${red}${green}${green}${blue}${blue}`.toLowerCase()
}

function hasDiagramInterchange(element: unknown) {
  const di = (element as { di?: { get?: unknown } } | undefined)?.di
  return typeof di?.get === 'function'
}

export function readElementColors(
  element: unknown,
  customTextColor: string | undefined,
  isDarkTheme: boolean,
) {
  const defaults = themedDefaultColors(isDarkTheme)
  const hasColors = hasDiagramInterchange(element)
  const fill = hasColors
    ? getFillColor(element as never, defaults.fill)
    : defaults.fill
  const stroke = hasColors
    ? getStrokeColor(element as never, defaults.stroke)
    : defaults.stroke
  return {
    fill: toColorInputValue(fill, defaults.fill),
    stroke: toColorInputValue(stroke, defaults.stroke),
    text: toColorInputValue(customTextColor ?? stroke, defaults.stroke),
  }
}
