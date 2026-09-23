import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { DiagramLibrary } from '@/features/library/DiagramLibrary'

const BpmnEditor = lazy(() =>
  import('@/features/editor/BpmnEditor').then((module) => ({ default: module.BpmnEditor })),
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DiagramLibrary />} />
        <Route
          path="/editor/:id"
          element={
            <Suspense fallback={null}>
              <BpmnEditor />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
