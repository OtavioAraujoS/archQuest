import { describe, expect, it } from 'vitest'

import { needsNewThumbnail } from '@/lib/diagrams/thumbnail-health'

describe('needsNewThumbnail', () => {
  it('asks for a thumbnail when there is none', () => {
    expect(needsNewThumbnail(undefined)).toBe(true)
  })

  it('asks again for a thumbnail exported from a detached canvas', () => {
    expect(
      needsNewThumbnail('<svg width="20" height="20" viewBox="-10 -10 20 20">'),
    ).toBe(true)
  })

  it('asks again for a thumbnail saved with a broken XML declaration', () => {
    const declaration = '<?xml version="1.0" encoding="utf-8"?>'
    expect(
      needsNewThumbnail(
        `${declaration}\n${declaration}<svg width="420" height="180">`,
      ),
    ).toBe(true)
  })

  it('keeps a thumbnail that shows the diagram', () => {
    expect(
      needsNewThumbnail('<svg width="420" height="180" viewBox="0 0 420 180">'),
    ).toBe(false)
  })
})
