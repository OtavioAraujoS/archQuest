import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DialogActions } from '@/components/ui/dialog-actions'
import { DisplayHeading } from '@/components/ui/display-heading'
import { ErrorMessage } from '@/components/ui/error-message'
import { ExternalLink } from '@/components/ui/external-link'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'

describe('shared UI components', () => {
  it('announces error messages to assistive technology', () => {
    render(<ErrorMessage className="mt-3">Algo deu errado</ErrorMessage>)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Algo deu errado')
    expect(alert).toHaveClass('text-destructive', 'mt-3')
  })

  it('renders display headings at the requested level and size', () => {
    render(
      <DisplayHeading as="h1" size="subtitle">
        Meus diagramas
      </DisplayHeading>,
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveClass(
      'font-display',
      'text-xl',
    )
  })

  it('opens external links in a new tab without leaking the opener', () => {
    render(<ExternalLink href="https://bpmn.io">bpmn.io</ExternalLink>)

    const link = screen.getByRole('link', { name: 'bpmn.io' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })

  it('sizes fields and lets callers add their own classes', () => {
    render(
      <>
        <Input size="sm" aria-label="Nome" className="w-24" />
        <NativeSelect aria-label="Ordem">
          <option>Nome</option>
        </NativeSelect>
      </>,
    )

    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveClass(
      'h-8',
      'w-24',
    )
    expect(screen.getByRole('combobox', { name: 'Ordem' })).toHaveClass('h-9')
  })

  it('aligns dialog actions to the end', () => {
    render(
      <DialogActions>
        <button type="button">Cancelar</button>
      </DialogActions>,
    )

    expect(
      screen.getByRole('button', { name: 'Cancelar' }).parentElement,
    ).toHaveClass('justify-end')
  })
})
