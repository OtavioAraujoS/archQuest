import { describe, expect, it } from 'vitest'

import { CLOUD_MAX_TEXT_BYTES, exceedsCloudSizeLimit } from '@/lib/sync/cloud-size-limit'

describe('exceedsCloudSizeLimit', () => {
  it('accepts text exactly at the 2 MB limit', () => {
    expect(exceedsCloudSizeLimit('x'.repeat(CLOUD_MAX_TEXT_BYTES))).toBe(false)
  })

  it('rejects text one byte above the limit', () => {
    expect(exceedsCloudSizeLimit('x'.repeat(CLOUD_MAX_TEXT_BYTES + 1))).toBe(true)
  })

  it('counts bytes, not characters, like the database constraint', () => {
    const accentedText = 'ã'.repeat(CLOUD_MAX_TEXT_BYTES / 2 + 1)

    expect(accentedText.length).toBeLessThan(CLOUD_MAX_TEXT_BYTES)
    expect(exceedsCloudSizeLimit(accentedText)).toBe(true)
  })
})
