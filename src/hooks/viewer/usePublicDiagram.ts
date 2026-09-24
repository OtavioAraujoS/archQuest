import { useEffect, useState } from 'react'

import { fetchPublicDiagram } from '@/lib/sharing/fetch-public-diagram'
import type { PublicDiagram } from '@/lib/supabase/database-types'

export type PublicDiagramLookup =
  | { status: 'loading' }
  | { status: 'found'; diagram: PublicDiagram }
  | { status: 'not-found' }
  | { status: 'failed' }

interface FinishedLookup {
  slug: string
  lookup: PublicDiagramLookup
}

export function usePublicDiagram(
  slug: string | undefined,
): PublicDiagramLookup {
  const [finishedLookup, setFinishedLookup] = useState<FinishedLookup | null>(
    null,
  )

  useEffect(() => {
    if (!slug) return
    let isCancelled = false
    const finishLookup = (lookup: PublicDiagramLookup) => {
      if (!isCancelled) setFinishedLookup({ slug, lookup })
    }
    fetchPublicDiagram(slug).then(
      (diagram) =>
        finishLookup(
          diagram ? { status: 'found', diagram } : { status: 'not-found' },
        ),
      () => finishLookup({ status: 'failed' }),
    )
    return () => {
      isCancelled = true
    }
  }, [slug])

  if (!slug) return { status: 'not-found' }
  if (finishedLookup?.slug !== slug) return { status: 'loading' }
  return finishedLookup.lookup
}
