import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthCallback } from '@/components/auth/AuthCallback'
import { EditorSkeleton } from '@/components/editor/EditorSkeleton'
import { LandingPage } from '@/components/landing/LandingPage'
import { DiagramLibrary } from '@/components/library/DiagramLibrary'
import { AUTH_CALLBACK_PATH } from '@/lib/auth/auth-actions'
import { startAuthSession } from '@/lib/auth/auth-session'
import { LANDING_PATH, LIBRARY_PATH } from '@/lib/routes'
import { PUBLIC_VIEW_PATH } from '@/lib/sharing/public-link'
import { startDiagramSyncWhileSignedIn } from '@/lib/sync/sync-while-signed-in'

const BpmnEditor = lazy(() =>
  import('@/components/editor/BpmnEditor').then((module) => ({ default: module.BpmnEditor })),
)
const PublicViewer = lazy(() =>
  import('@/components/viewer/PublicViewer').then((module) => ({ default: module.PublicViewer })),
)

function App() {
  useEffect(() => startAuthSession(), [])
  useEffect(() => startDiagramSyncWhileSignedIn(), [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path={LANDING_PATH} element={<LandingPage />} />
        <Route path={LIBRARY_PATH} element={<DiagramLibrary />} />
        <Route path={AUTH_CALLBACK_PATH} element={<AuthCallback />} />
        <Route
          path={PUBLIC_VIEW_PATH}
          element={
            <Suspense fallback={null}>
              <PublicViewer />
            </Suspense>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <Suspense fallback={<EditorSkeleton />}>
              <BpmnEditor />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
