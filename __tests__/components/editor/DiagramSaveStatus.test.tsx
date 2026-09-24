import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { DiagramSaveStatus } from '@/components/editor/DiagramSaveStatus'
import { db } from '@/lib/db'
import { makeDiagramRecord } from './test-support/bpmn-editor-fakes'

describe('DiagramSaveStatus', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
    await db.diagrams.add(makeDiagramRecord())
  })

  it('says nothing before the first change', () => {
    render(<DiagramSaveStatus diagramId="diagram-1" autosaveState="idle" />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('tells a guest where the diagram was saved', async () => {
    render(<DiagramSaveStatus diagramId="diagram-1" autosaveState="saved" />)

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Salvo neste navegador',
    )
  })

  it('warns when the browser could not save', async () => {
    render(<DiagramSaveStatus diagramId="diagram-1" autosaveState="failed" />)

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Não foi possível salvar',
    )
  })
})
