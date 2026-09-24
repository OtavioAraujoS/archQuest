import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DIAGRAM_TEMPLATES } from '@/templates'

const { mockNavigate, mockCreateDiagram } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockCreateDiagram: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => mockNavigate,
}))
vi.mock('@/lib/create-diagram', () => ({ createDiagram: mockCreateDiagram }))
vi.mock('@/components/templates/TemplatePreviewCanvas', () => ({
  default: ({ bpmnXml }: { bpmnXml: string }) => (
    <div data-testid="preview" data-bpmn-xml={bpmnXml} />
  ),
}))

import { LandingPage } from '@/components/landing/LandingPage'

function renderLandingPage() {
  render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  )
}

describe('LandingPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockCreateDiagram.mockReset()
    mockCreateDiagram.mockResolvedValue('new-diagram')
  })

  it('states the value proposition and links to the diagram library', () => {
    renderLandingPage()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('BPMN 2.0')
    expect(screen.getByRole('link', { name: 'Meus diagramas' })).toHaveAttribute(
      'href',
      '/diagramas',
    )
  })

  it('creates a blank diagram and opens it in the editor', async () => {
    renderLandingPage()

    fireEvent.click(screen.getByRole('button', { name: 'Novo diagrama' }))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/editor/new-diagram'))
    expect(mockCreateDiagram).toHaveBeenCalledWith()
  })

  it('opens the selected template as a new diagram', async () => {
    const [, onboardingTemplate] = DIAGRAM_TEMPLATES
    renderLandingPage()

    fireEvent.click(screen.getByRole('tab', { name: new RegExp(onboardingTemplate.name) }))
    fireEvent.click(screen.getByRole('button', { name: 'Usar este modelo' }))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/editor/new-diagram'))
    expect(mockCreateDiagram).toHaveBeenCalledWith(onboardingTemplate.name, onboardingTemplate.xml)
  })

  it('previews the selected template', async () => {
    const [, onboardingTemplate] = DIAGRAM_TEMPLATES
    renderLandingPage()

    fireEvent.click(screen.getByRole('tab', { name: new RegExp(onboardingTemplate.name) }))

    expect(await screen.findByTestId('preview')).toHaveAttribute(
      'data-bpmn-xml',
      onboardingTemplate.xml,
    )
  })
})
