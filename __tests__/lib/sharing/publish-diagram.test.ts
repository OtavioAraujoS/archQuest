import { beforeEach, describe, expect, it, vi } from 'vitest'

import { db } from '@/lib/db'
import { publishDiagram, unpublishDiagram } from '@/lib/sharing/publish-diagram'
import { makeAccountDiagram } from '../diagrams/diagram-fixtures'

const { setCloudPublicSlug } = vi.hoisted(() => ({ setCloudPublicSlug: vi.fn() }))

vi.mock('@/lib/diagrams/cloud-diagram-sharing', () => ({ setCloudPublicSlug }))

describe('publishing a diagram', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    setCloudPublicSlug.mockReset().mockImplementation(async (_id, publicSlug) => publicSlug)
  })

  it('stores a new random slug in the cloud and in this browser', async () => {
    await db.diagrams.add(makeAccountDiagram())

    const publicSlug = await publishDiagram('account-1')

    expect(setCloudPublicSlug).toHaveBeenCalledWith('account-1', publicSlug)
    expect(publicSlug).toMatch(/^[A-Za-z0-9_-]{22}$/)
    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({ publicSlug })
  })

  it('generates a different link when published again', async () => {
    await db.diagrams.add(makeAccountDiagram())

    const firstSlug = await publishDiagram('account-1')
    await unpublishDiagram('account-1')
    const secondSlug = await publishDiagram('account-1')

    expect(secondSlug).not.toBe(firstSlug)
  })

  it('removes the slug from the cloud and from this browser when unpublished', async () => {
    await db.diagrams.add(makeAccountDiagram({ publicSlug: 'slugPublicoComEntropia01' }))

    await unpublishDiagram('account-1')

    expect(setCloudPublicSlug).toHaveBeenCalledWith('account-1', null)
    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({ publicSlug: null })
  })

  it('leaves this browser untouched when the cloud refuses', async () => {
    await db.diagrams.add(makeAccountDiagram())
    setCloudPublicSlug.mockRejectedValue(new Error('Failed to fetch'))

    await expect(publishDiagram('account-1')).rejects.toThrow('Failed to fetch')
    await expect(db.diagrams.get('account-1')).resolves.toMatchObject({ publicSlug: null })
  })
})
