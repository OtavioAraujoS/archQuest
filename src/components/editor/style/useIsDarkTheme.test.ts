import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { useIsDarkTheme } from './useIsDarkTheme'

describe('useIsDarkTheme', () => {
  afterEach(() => document.documentElement.classList.remove('dark'))

  it('reads the current theme from the document', () => {
    document.documentElement.classList.add('dark')

    const { result } = renderHook(() => useIsDarkTheme())

    expect(result.current).toBe(true)
  })

  it('follows theme changes on the document', async () => {
    const { result } = renderHook(() => useIsDarkTheme())
    expect(result.current).toBe(false)

    act(() => document.documentElement.classList.add('dark'))

    await waitFor(() => expect(result.current).toBe(true))
  })
})
