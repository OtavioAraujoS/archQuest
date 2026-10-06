import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SpellingIssuesMenu } from '@/components/editor/spelling/SpellingIssuesMenu'

const ISSUES = [
  { elementId: 'Task_1', text: 'Revisar proceso', words: ['proceso'] },
  {
    elementId: 'Task_2',
    text: 'Enviar emial urjente',
    words: ['emial', 'urjente'],
  },
]

describe('SpellingIssuesMenu', () => {
  it('counts the misspelled words and shows where each one is', () => {
    render(<SpellingIssuesMenu issues={ISSUES} onGoToIssue={vi.fn()} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Erros de ortografia: 3' }),
    )

    expect(screen.getByRole('menuitem', { name: /proceso/ })).toHaveTextContent(
      'em “Revisar proceso”',
    )
    expect(
      screen.getByRole('menuitem', { name: /emial, urjente/ }),
    ).toBeVisible()
  })

  it('takes the user to the element of the chosen issue', () => {
    const onGoToIssue = vi.fn()
    render(<SpellingIssuesMenu issues={ISSUES} onGoToIssue={onGoToIssue} />)

    fireEvent.click(screen.getByRole('button', { name: /Erros de ortografia/ }))
    fireEvent.click(screen.getByRole('menuitem', { name: /emial/ }))

    expect(onGoToIssue).toHaveBeenCalledWith('Task_2')
  })

  it('says so when the diagram has no misspellings', () => {
    render(<SpellingIssuesMenu issues={[]} onGoToIssue={vi.fn()} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Erros de ortografia: 0' }),
    )

    expect(screen.getByText('Nenhum erro de ortografia')).toBeVisible()
  })
})
