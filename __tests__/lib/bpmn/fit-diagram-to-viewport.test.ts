import { describe, expect, it, vi } from 'vitest'

import { fitDiagramToViewport } from '@/lib/bpmn/fit-diagram-to-viewport'

describe('fitDiagramToViewport', () => {
  it('zooms the canvas to show the whole diagram, centered', () => {
    const zoom = vi.fn()
    const get = vi.fn().mockReturnValue({ zoom })

    fitDiagramToViewport({ get })

    expect(get).toHaveBeenCalledWith('canvas')
    expect(zoom).toHaveBeenCalledWith('fit-viewport', 'auto')
  })
})
