import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { DiagramLibrary } from '@/components/library/DiagramLibrary'

export function renderDiagramLibrary() {
  return render(
    <MemoryRouter initialEntries={['/diagramas']}>
      <DiagramLibrary />
    </MemoryRouter>,
  )
}
