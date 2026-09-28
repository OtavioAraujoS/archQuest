import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { DiagramLibrary } from '@/components/library/DiagramLibrary'
import { LIBRARY_FOLDER_PATH, LIBRARY_PATH } from '@/lib/routes'

export function renderDiagramLibrary(path: string = LIBRARY_PATH) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={LIBRARY_PATH} element={<DiagramLibrary />} />
        <Route path={LIBRARY_FOLDER_PATH} element={<DiagramLibrary />} />
      </Routes>
    </MemoryRouter>,
  )
}

export async function chooseDiagramAction(
  diagramName: string,
  action: string,
) {
  fireEvent.click(
    await screen.findByRole('button', {
      name: `Ações do diagrama ${diagramName}`,
    }),
  )
  fireEvent.click(screen.getByRole('menuitem', { name: action }))
}
