export interface DiagramSvgSource {
  saveSVG: () => Promise<{ svg: string }>
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadBpmnXml(xml: string, name: string) {
  downloadBlob(new Blob([xml], { type: 'application/xml' }), `${name}.bpmn`)
}

export async function exportSvg(diagramSource: DiagramSvgSource, name: string) {
  const { svg } = await diagramSource.saveSVG()
  downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), `${name}.svg`)
}

const PNG_EXPORT_SCALE = 2

export async function exportPng(diagramSource: DiagramSvgSource, name: string) {
  const { svg } = await diagramSource.saveSVG()
  const blob = await svgStringToPngBlob(svg)
  downloadBlob(blob, `${name}.png`)
}

function svgStringToPngBlob(svg: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    const image = new Image()

    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width * PNG_EXPORT_SCALE
      canvas.height = image.height * PNG_EXPORT_SCALE
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error('Canvas 2D context unavailable'))
        return
      }
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(PNG_EXPORT_SCALE, PNG_EXPORT_SCALE)
      ctx.drawImage(image, 0, 0)
      URL.revokeObjectURL(url)
      canvas.toBlob((pngBlob) => {
        if (pngBlob) resolve(pngBlob)
        else reject(new Error('PNG conversion failed'))
      }, 'image/png')
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to rasterize diagram SVG'))
    }

    image.src = url
  })
}
