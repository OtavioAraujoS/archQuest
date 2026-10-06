import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { PersonalDictionaryButton } from '@/components/spelling/PersonalDictionaryButton'
import { isAcceptedTerm, replaceUserTerms } from '@/lib/spelling/accepted-terms'

describe('PersonalDictionaryButton', () => {
  beforeEach(() => replaceUserTerms(['kafka', 'grpc']))

  it('lists the accepted words and removes the chosen one', () => {
    render(<PersonalDictionaryButton />)

    fireEvent.click(screen.getByRole('button', { name: 'Dicionário pessoal' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remover kafka' }))

    expect(screen.queryByText('kafka')).not.toBeInTheDocument()
    expect(screen.getByText('grpc')).toBeVisible()
    expect(isAcceptedTerm('Kafka')).toBe(false)
  })

  it('explains how to add words while the dictionary is empty', () => {
    replaceUserTerms([])
    render(<PersonalDictionaryButton />)

    fireEvent.click(screen.getByRole('button', { name: 'Dicionário pessoal' }))

    expect(screen.getByText(/Nenhuma palavra adicionada/)).toBeVisible()
  })
})
