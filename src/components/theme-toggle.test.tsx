import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockGetPreferredTheme, mockSetTheme } = vi.hoisted(() => ({
  mockGetPreferredTheme: vi.fn(),
  mockSetTheme: vi.fn(),
}))

vi.mock('@/lib/theme', () => ({
  getPreferredTheme: mockGetPreferredTheme,
  setTheme: mockSetTheme,
}))

import { ThemeToggle } from './theme-toggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockGetPreferredTheme.mockReset()
    mockSetTheme.mockReset()
  })

  it('starts from the preferred theme and shows an icon', () => {
    mockGetPreferredTheme.mockReturnValue('light')

    render(<ThemeToggle />)

    const button = screen.getByRole('button', { name: 'Alternar tema' })
    expect(button.querySelector('svg')).toBeInTheDocument()
  })

  it('switches to dark when starting in light mode', () => {
    mockGetPreferredTheme.mockReturnValue('light')
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button', { name: 'Alternar tema' }))

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('switches to light when starting in dark mode', () => {
    mockGetPreferredTheme.mockReturnValue('dark')
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button', { name: 'Alternar tema' }))

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })
})
