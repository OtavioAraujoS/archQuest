interface ZoomableCanvas {
  zoom(level: 'fit-viewport', center: 'auto'): void
}

interface DiagramWithCanvas {
  get<Service>(name: 'canvas'): Service
}

export function fitDiagramToViewport(diagram: DiagramWithCanvas) {
  diagram.get<ZoomableCanvas>('canvas').zoom('fit-viewport', 'auto')
}
