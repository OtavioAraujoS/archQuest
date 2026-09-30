import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SpellingHint } from '@/components/spelling/SpellingHint'

const spellingClient = await vi.hoisted(async () => {
  const { createFakeSpellingClient } = await import('./fake-spelling-client')
  return createFakeSpellingClient()
})

vi.mock('@/lib/spelling/spelling-client', () => spellingClient)

describe('SpellingHint', () => {
  beforeEach(() => {
    spellingClient.forgetMisspellings()
  })

  it('shows nothing for correctly spelled text', async () => {
    render(<SpellingHint text="Processo de compra" onReplaceText={vi.fn()} />)

    await vi.waitFor(() => expect(spellingClient.checkWords).toHaveBeenCalled())
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('lists the misspelled words', async () => {
    spellingClient.treatAsMisspelled('proceso', ['processo'])
    render(<SpellingHint text="Novo proceso" onReplaceText={vi.fn()} />)

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Verifique a ortografia:',
    )
    expect(screen.getByRole('button', { name: 'proceso' })).toBeVisible()
  })

  it('replaces the word with the chosen suggestion', async () => {
    spellingClient.treatAsMisspelled('proceso', ['processo', 'procedo'])
    const onReplaceText = vi.fn()
    render(<SpellingHint text="Novo proceso aqui" onReplaceText={onReplaceText} />)

    fireEvent.click(await screen.findByRole('button', { name: 'proceso' }))
    fireEvent.click(await screen.findByRole('button', { name: 'processo' }))

    expect(onReplaceText).toHaveBeenCalledWith('Novo processo aqui')
  })

  it('tells when there is no suggestion for the word', async () => {
    spellingClient.treatAsMisspelled('xyzqwk', [])
    render(<SpellingHint text="xyzqwk" onReplaceText={vi.fn()} />)

    fireEvent.click(await screen.findByRole('button', { name: 'xyzqwk' }))

    expect(await screen.findByText('Sem sugestões')).toBeVisible()
  })

  it('keeps the focus on the field while the user picks a word', async () => {
    spellingClient.treatAsMisspelled('proceso', ['processo'])
    render(<SpellingHint text="proceso" onReplaceText={vi.fn()} />)

    const misspelledWord = await screen.findByRole('button', { name: 'proceso' })

    expect(fireEvent.mouseDown(misspelledWord)).toBe(false)
  })
})
