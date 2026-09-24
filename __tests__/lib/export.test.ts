import type BpmnModeler from 'bpmn-js/lib/Modeler'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { downloadBlob, downloadBpmnXml, exportPng, exportSvg } from '@/lib/export'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function mockDownloadInternals() {
  const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
  const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  return { createObjectURL, revokeObjectURL, click }
}

describe('downloadBlob', () => {
  it('creates an object URL, triggers a download and revokes the URL', () => {
    const { createObjectURL, revokeObjectURL, click } = mockDownloadInternals()

    downloadBlob(new Blob(['data']), 'diagram.bpmn')

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    expect(click).toHaveBeenCalledTimes(1)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })
})

describe('downloadBpmnXml', () => {
  it('downloads the XML as a .bpmn file named after the diagram', async () => {
    const { createObjectURL } = mockDownloadInternals()
    const downloadNames: string[] = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      downloadNames.push(this.download)
    })

    downloadBpmnXml('<bpmn:definitions />', 'Reembolso')

    const [downloadedBlob] = createObjectURL.mock.calls[0] as [Blob]
    expect(downloadNames).toEqual(['Reembolso.bpmn'])
    expect(downloadedBlob.type).toBe('application/xml')
    await expect(downloadedBlob.text()).resolves.toBe('<bpmn:definitions />')
  })
})

describe('exportSvg', () => {
  it('downloads the modeler SVG output as a .svg file', async () => {
    const { createObjectURL } = mockDownloadInternals()
    const modeler = {
      saveSVG: vi.fn().mockResolvedValue({ svg: '<svg></svg>' }),
    } as unknown as BpmnModeler

    await exportSvg(modeler, 'my-process')

    expect(modeler.saveSVG).toHaveBeenCalledTimes(1)
    const [blob] = createObjectURL.mock.calls[0] as [Blob]
    expect(blob.type).toBe('image/svg+xml')
  })
})

describe('exportPng', () => {
  it('rasterizes the modeler SVG output and downloads it as a .png file', async () => {
    const { createObjectURL } = mockDownloadInternals()
    const modeler = {
      saveSVG: vi.fn().mockResolvedValue({ svg: '<svg width="10" height="10"></svg>' }),
    } as unknown as BpmnModeler

    class FakeImage {
      width = 100
      height = 80
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      set src(_value: string) {
        queueMicrotask(() => this.onload?.())
      }
    }
    vi.stubGlobal('Image', FakeImage)

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillRect: vi.fn(),
      scale: vi.fn(),
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D)

    const fakePngBlob = new Blob(['png'], { type: 'image/png' })
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
      callback?.(fakePngBlob)
    })

    await exportPng(modeler, 'my-process')

    expect(modeler.saveSVG).toHaveBeenCalledTimes(1)
    expect(createObjectURL).toHaveBeenCalledWith(fakePngBlob)
  })
})
