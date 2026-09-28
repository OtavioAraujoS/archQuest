import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useCachedDiagram } from '@/hooks/diagrams/useCachedDiagram'
import { db } from '@/lib/db'
import { makeDiagramRecord } from '../../components/editor/test-support/bpmn-editor-fakes'

describe('useCachedDiagram', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    await db.diagrams.add(makeDiagramRecord())
  })

  it('reads the diagram saved in this browser', async () => {
    const { result } = renderHook(() => useCachedDiagram('diagram-1'))

    await waitFor(() => expect(result.current?.id).toBe('diagram-1'))
  })

  it('answers nothing without a diagram id', async () => {
    const { result } = renderHook(() => useCachedDiagram(undefined))

    await waitFor(() => expect(result.current).toBeUndefined())
  })
})
