export interface DiagramThemeColors {
  defaultFillColor: string
  defaultStrokeColor: string
  defaultLabelColor: string
}

function readCustomProperty(element: Element, propertyName: string) {
  return getComputedStyle(element).getPropertyValue(propertyName).trim()
}

export function readDiagramThemeColors(element: Element): DiagramThemeColors {
  const strokeColor = readCustomProperty(element, '--foreground')
  return {
    defaultFillColor: readCustomProperty(element, '--card'),
    defaultStrokeColor: strokeColor,
    defaultLabelColor: strokeColor,
  }
}
