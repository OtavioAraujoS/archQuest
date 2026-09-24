import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu-item'

function renderFileMenu() {
  const onExport = vi.fn()
  const onImport = vi.fn()
  render(
    <DropdownMenu trigger="Arquivo" menuLabel="Arquivo">
      <DropdownMenuItem onSelect={onImport}>Importar</DropdownMenuItem>
      <DropdownMenuItem onSelect={onExport}>Exportar</DropdownMenuItem>
    </DropdownMenu>,
  )
  const trigger = screen.getByRole('button', { name: 'Arquivo' })
  return { trigger, onExport, onImport }
}

describe('DropdownMenu', () => {
  it('opens a labelled menu and focuses its first item', () => {
    const { trigger } = renderFileMenu()

    fireEvent.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menu', { name: 'Arquivo' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Importar' })).toHaveFocus()
  })

  it('moves between items with the arrow keys, wrapping around', () => {
    const { trigger } = renderFileMenu()
    fireEvent.click(trigger)
    const menu = screen.getByRole('menu')

    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(screen.getByRole('menuitem', { name: 'Exportar' })).toHaveFocus()

    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(screen.getByRole('menuitem', { name: 'Importar' })).toHaveFocus()

    fireEvent.keyDown(menu, { key: 'End' })
    expect(screen.getByRole('menuitem', { name: 'Exportar' })).toHaveFocus()
  })

  it('runs the chosen item and closes, returning focus to the trigger', () => {
    const { trigger, onExport } = renderFileMenu()
    fireEvent.click(trigger)

    fireEvent.click(screen.getByRole('menuitem', { name: 'Exportar' }))

    expect(onExport).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes on Escape and on a click outside', () => {
    const { trigger } = renderFileMenu()

    fireEvent.click(trigger)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    fireEvent.click(trigger)
    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
