import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MigrateGuestDiagramsDialog } from '@/components/auth/MigrateGuestDiagramsDialog'
import { AppHeader } from '@/components/layout/AppHeader'
import { DeleteDiagramDialog } from '@/components/library/DeleteDiagramDialog'
import { DiagramGrid } from '@/components/library/DiagramGrid'
import { LibraryEmptyState } from '@/components/library/LibraryEmptyState'
import { LibraryHeading } from '@/components/library/LibraryHeading'
import { LibraryToolbar } from '@/components/library/LibraryToolbar'
import { NoSearchResults } from '@/components/library/NoSearchResults'
import { SignedInDiagramSections } from '@/components/library/SignedInDiagramSections'
import { TemplatePicker } from '@/components/library/TemplatePicker'
import { useDiagramDeletion } from '@/hooks/library/useDiagramDeletion'
import { useDiagramFilters } from '@/hooks/library/useDiagramFilters'
import { useGuestMigrationPrompt } from '@/hooks/library/useGuestMigrationPrompt'
import { useLibraryDiagrams } from '@/hooks/library/useLibraryDiagrams'
import { useOpenDiagramFile } from '@/hooks/library/useOpenDiagramFile'
import { useStartDiagram } from '@/hooks/useStartDiagram'
import { isFileSystemAccessSupported } from '@/lib/file-system/file-system-support'
import { editorPath } from '@/lib/routes'

export function DiagramLibrary() {
  const navigate = useNavigate()
  const { ownerId, accountDiagrams, guestDiagrams, cloudPullStatus } =
    useLibraryDiagrams()
  const { isGuestMigrationOpen, openGuestMigration, closeGuestMigration } =
    useGuestMigrationPrompt(ownerId, guestDiagrams)
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false)
  const closeTemplatePicker = useCallback(
    () => setIsTemplatePickerOpen(false),
    [],
  )
  const openDiagram = (id: string) => navigate(editorPath(id))
  const { startBlankDiagram, startDiagramFromTemplate } = useStartDiagram()
  const { openFileAsDiagram, fileOpenError } = useOpenDiagramFile(openDiagram)
  const filters = useDiagramFilters()
  const deletion = useDiagramDeletion()

  const visibleAccountDiagrams = filters.applyFilters(accountDiagrams)
  const visibleGuestDiagrams = filters.applyFilters(guestDiagrams)
  const savedDiagramCount =
    (ownerId ? (accountDiagrams?.length ?? 0) : 0) +
    (guestDiagrams?.length ?? 0)
  const visibleDiagramCount =
    (ownerId ? (visibleAccountDiagrams?.length ?? 0) : 0) +
    (visibleGuestDiagrams?.length ?? 0)
  const openTemplatePicker = () => setIsTemplatePickerOpen(true)

  function emptyStateWith(message: string) {
    if (filters.isSearching) {
      return (
        <NoSearchResults
          searchQuery={filters.searchQuery}
          onClearSearch={filters.clearSearch}
        />
      )
    }
    return (
      <LibraryEmptyState
        message={message}
        onStartBlankDiagram={() => void startBlankDiagram()}
        onBrowseTemplates={openTemplatePicker}
      />
    )
  }

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <LibraryHeading
          isSignedIn={ownerId !== null}
          canOpenFiles={isFileSystemAccessSupported()}
          onStartBlankDiagram={() => void startBlankDiagram()}
          onBrowseTemplates={openTemplatePicker}
          onOpenFile={() => void openFileAsDiagram()}
        />
        {fileOpenError && (
          <p role="alert" className="text-destructive text-sm">
            {fileOpenError}
          </p>
        )}
        {savedDiagramCount > 0 && (
          <LibraryToolbar
            searchQuery={filters.searchQuery}
            onSearchQueryChange={filters.setSearchQuery}
            sortOrder={filters.sortOrder}
            onSortOrderChange={filters.setSortOrder}
            visibleDiagramCount={visibleDiagramCount}
          />
        )}
        {ownerId ? (
          <SignedInDiagramSections
            accountDiagrams={visibleAccountDiagrams}
            guestDiagrams={visibleGuestDiagrams}
            hasGuestDiagrams={(visibleGuestDiagrams?.length ?? 0) > 0}
            cloudPullStatus={cloudPullStatus}
            accountEmptyState={emptyStateWith(
              'Nenhum diagrama na sua conta ainda. Crie o primeiro para começar.',
            )}
            onOpen={openDiagram}
            onDelete={deletion.requestDeletion}
            onMoveGuestDiagrams={openGuestMigration}
          />
        ) : (
          <DiagramGrid
            diagrams={visibleGuestDiagrams}
            emptyState={emptyStateWith(
              'Nenhum diagrama ainda. Crie o primeiro para começar a modelar um processo.',
            )}
            onOpen={openDiagram}
            onDelete={deletion.requestDeletion}
          />
        )}
      </main>

      {isTemplatePickerOpen && (
        <TemplatePicker
          onTemplateChosen={(template) =>
            void startDiagramFromTemplate(template)
          }
          onClose={closeTemplatePicker}
        />
      )}
      {isGuestMigrationOpen && ownerId && guestDiagrams && (
        <MigrateGuestDiagramsDialog
          ownerId={ownerId}
          guestDiagrams={guestDiagrams}
          onClose={closeGuestMigration}
        />
      )}
      {deletion.diagramPendingDeletion && (
        <DeleteDiagramDialog
          diagram={deletion.diagramPendingDeletion}
          isDeleting={deletion.isDeleting}
          deletionError={deletion.deletionError}
          onCancel={deletion.cancelDeletion}
          onConfirm={() => void deletion.confirmDeletion()}
        />
      )}
    </div>
  )
}
