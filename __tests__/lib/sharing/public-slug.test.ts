import { describe, expect, it } from 'vitest'

import { createPublicSlug, PUBLIC_SLUG_RANDOM_BYTES } from '@/lib/sharing/public-slug'

const DATABASE_SLUG_FORMAT = /^[A-Za-z0-9_-]{22,}$/

describe('createPublicSlug', () => {
  it('draws at least 128 random bits', () => {
    expect(PUBLIC_SLUG_RANDOM_BYTES * 8).toBeGreaterThanOrEqual(128)
  })

  it('produces a URL-safe slug accepted by the database constraint', () => {
    for (let attempt = 0; attempt < 200; attempt++) {
      expect(createPublicSlug()).toMatch(DATABASE_SLUG_FORMAT)
    }
  })

  it('gives a different slug every time', () => {
    const slugs = new Set(Array.from({ length: 1000 }, createPublicSlug))

    expect(slugs.size).toBe(1000)
  })

  it('is not derived from any diagram id', () => {
    expect(createPublicSlug.length).toBe(0)
  })
})
