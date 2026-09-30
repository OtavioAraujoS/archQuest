import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FolderNameDialog } from '@/components/library/folders/FolderNameDialog'

const spellingClient = await vi.hoisted(async () => {
  const { createFakeSpellingClient } = await import(
    '../../spelling/fake-spelling-client'
  )
  return createFakeSpellingClient()
})

vi.mock('@/lib/spelling/spelling-client', () => spellingClient)

function renderFolderNameDialog(currentName?: string) {
  const onSubmit = vi.fn()
  render(
    <FolderNameDialog
      currentName={currentName}
      error={null}
      isSaving={false}
      onCancel={vi.fn()}
      onSubmit={onSubmit}
    />,
  )
  return { onSubmit, nameInput: screen.getByLabelText('Nome da pasta') }
}

describe('FolderNameDialog spelling', () => {
  beforeEach(() => {
    spellingClient.forgetMisspellings()
  })

  it('points out a misspelled word typed in the folder name', async () => {
    spellingClient.treatAsMisspelled('Procesos', ['Processos'])
    const { nameInput } = renderFolderNameDialog()

    fireEvent.change(nameInput, { target: { value: 'Procesos internos' } })

    expect(await screen.findByRole('button', { name: 'Procesos' })).toBeVisible()
  })

  it('checks the current name when renaming', async () => {
    spellingClient.treatAsMisspelled('Finanças', ['Finanças'])
    renderFolderNameDialog('Finanças')

    expect(await screen.findByRole('button', { name: 'Finanças' })).toBeVisible()
  })

  it('submits the name corrected with the chosen suggestion', async () => {
    spellingClient.treatAsMisspelled('Procesos', ['Processos'])
    const { nameInput, onSubmit } = renderFolderNameDialog()
    fireEvent.change(nameInput, { target: { value: 'Procesos internos' } })

    fireEvent.click(await screen.findByRole('button', { name: 'Procesos' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Processos' }))
    fireEvent.click(screen.getByRole('button', { name: 'Criar pasta' }))

    expect(nameInput).toHaveValue('Processos internos')
    expect(onSubmit).toHaveBeenCalledWith('Processos internos')
  })
})
