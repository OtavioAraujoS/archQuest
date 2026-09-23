import { render, screen, waitFor } from '@testing-library/react'
import { expect } from 'vitest'

import { db } from '@/lib/db'

import { makeDiagramRecord } from './bpmn-editor-fakes'
import { BpmnEditorTestHarness } from './BpmnEditorTestHarness'

export function renderBpmnEditor(id?: string) {
  return render(<BpmnEditorTestHarness id={id} />)
}

export async function waitForEditorStatus(status: string) {
  await waitFor(() =>
    expect(screen.getByTestId('status')).toHaveTextContent(status),
  )
}

export async function renderLoadedBpmnEditor() {
  await db.diagrams.add(makeDiagramRecord())
  const rendered = renderBpmnEditor('diagram-1')
  await waitForEditorStatus('ready')
  return rendered
}
