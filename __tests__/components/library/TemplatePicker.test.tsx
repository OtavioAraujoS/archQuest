import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TemplatePicker } from '@/components/library/TemplatePicker'
import { DIAGRAM_TEMPLATES } from '@/templates'

function renderTemplatePicker() {
  const onTemplateChosen = vi.fn()
  const onClose = vi.fn()
  render(
    <TemplatePicker onTemplateChosen={onTemplateChosen} onClose={onClose} />,
  )
  const dialog = screen.getByRole('dialog', {
    name: 'Começar a partir de um template',
  }) as HTMLDialogElement
  return { dialog, onTemplateChosen, onClose }
}

describe('TemplatePicker', () => {
  it('opens as a native modal dialog that closes on outside click and Esc', () => {
    const { dialog } = renderTemplatePicker()

    expect(dialog.tagName).toBe('DIALOG')
    expect(dialog.open).toBe(true)
    expect(dialog).toHaveAttribute('closedby', 'any')
  })

  it('lists every template with its name and description', () => {
    const { dialog } = renderTemplatePicker()

    for (const template of DIAGRAM_TEMPLATES) {
      expect(within(dialog).getByText(template.name)).toBeInTheDocument()
      expect(within(dialog).getByText(template.description)).toBeInTheDocument()
    }
  })

  it('reports the chosen template', () => {
    const { onTemplateChosen } = renderTemplatePicker()
    const [, onboardingTemplate] = DIAGRAM_TEMPLATES

    fireEvent.click(
      screen.getByRole('button', { name: new RegExp(onboardingTemplate.name) }),
    )

    expect(onTemplateChosen).toHaveBeenCalledWith(onboardingTemplate)
  })

  it('closes the dialog through the close button', () => {
    const { dialog, onClose } = renderTemplatePicker()

    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(dialog.open).toBe(false)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('reports any native close, such as Esc or a click outside', () => {
    const { dialog, onClose } = renderTemplatePicker()

    fireEvent(dialog, new Event('close'))

    expect(onClose).toHaveBeenCalledOnce()
  })
})
