import { describe, expect, it } from 'vitest'

import { LANDING_PATH, LIBRARY_PATH, editorPath } from '@/lib/routes'

describe('routes', () => {
  it('keeps the landing page at the root and the library under /diagramas', () => {
    expect(LANDING_PATH).toBe('/')
    expect(LIBRARY_PATH).toBe('/diagramas')
  })

  it('builds the editor path of a diagram', () => {
    expect(editorPath('diagram-1')).toBe('/editor/diagram-1')
  })
})
