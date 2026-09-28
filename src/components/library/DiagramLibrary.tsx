import { useNavigate } from 'react-router-dom'

import { AppHeader } from '@/components/layout/AppHeader'
import { buildLibraryView } from '@/components/library/build-library-view'
import type { DiagramCardActions } from '@/components/library/diagram-card-actions'
import { DiagramGrid } from '@/components/library/DiagramGrid'
import { FolderGrid } from '@/components/library/folders/FolderGrid'
import { LibraryDialogs } from '@/components/library/LibraryDialogs'
import { LibraryEmptyContent } from '@/components/library/LibraryEmptyContent'
import { LibraryHeading } from '@/components/library/LibraryHeading'
import { LibraryToolbar } from '@/components/library/LibraryToolbar'
import { SignedInDiagramSections } from '@/components/library/SignedInDiagramSections'
import { ErrorMessage } from '@/components/ui/error-message'
import { useFolder } from '@/hooks/folders/useFolder'
import { useDiagramDeletion } from '@/hooks/library/useDiagramDeletion'
import { useDiagramFilters } from '@/hooks/library/useDiagramFilters'
import { useGuestMigrationPrompt } from '@/hooks/library/useGuestMigrationPrompt'
import { useLibraryDiagrams } from '@/hooks/library/useLibraryDiagrams'
import { useOpenDiagramFile } from '@/hooks/library/useOpenDiagramFile'
import { useTemplatePicker } from '@/hooks/library/useTemplatePicker'
import { useStartDiagram } from '@/hooks/useStartDiagram'
import { isFileSystemAccessSupported } from '@/lib/file-system/file-system-support'
import { editorPath } from '@/lib/routes'

export function DiagramLibrary() {
  const navigate = useNavigate()
  const { ownerId, accountDiagrams, guestDiagrams, cloudPullStatus } =
    useLibraryDiagrams()
  const folder = useFolder()
  const { folders, currentFolder, currentFolderId, isOpeningFolder } = folder
  const { isGuestMigrationOpen, openGuestMigration, closeGuestMigration } =
    useGuestMigrationPrompt(ownerId, guestDiagrams)
  const { isTemplatePickerOpen, openTemplatePicker, closeTemplatePicker } =
    useTemplatePicker()
  const openDiagram = (id: string) => navigate(editorPath(id))
  const { startBlankDiagram, startDiagramFromTemplate } =
    useStartDiagram(currentFolderId)
  const { openFileAsDiagram, fileOpenError } = useOpenDiagramFile(
    openDiagram,
    currentFolderId,
  )
  const filters = useDiagramFilters()
  const deletion = useDiagramDeletion()

  const view = buildLibraryView({
    ownerId,
    accountDiagrams,
    guestDiagrams,
    folders,
    currentFolderId,
    isOpeningFolder,
    isSearching: filters.isSearching,
    applyFilters: filters.applyFilters,
  })
  const cardActions: DiagramCardActions = {
    folders: folders ?? [],
    showsFolderName: !currentFolderId && filters.isSearching,
    onOpen: openDiagram,
    onDelete: deletion.requestDeletion,
    onMoveToFolder: (diagram, folderId) =>
      void folder.moveDiagramToFolder(diagram.id, folderId),
  }
  const emptyState = view.hidesEmptyState ? null : (
    <LibraryEmptyContent
      isSearching={filters.isSearching}
      searchQuery={filters.searchQuery}
      onClearSearch={filters.clearSearch}
      isSignedIn={ownerId !== null}
      isInsideFolder={currentFolderId !== null}
      onStartBlankDiagram={() => void startBlankDiagram()}
      onBrowseTemplates={openTemplatePicker}
    />
  )

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <LibraryHeading
          isSignedIn={ownerId !== null}
          canOpenFiles={isFileSystemAccessSupported()}
          currentFolder={currentFolder}
          onStartBlankDiagram={() => void startBlankDiagram()}
          onBrowseTemplates={openTemplatePicker}
          onOpenFile={() => void openFileAsDiagram()}
          onCreateFolder={folder.requestNewFolder}
        />
        {fileOpenError && <ErrorMessage>{fileOpenError}</ErrorMessage>}
        {folder.folderError && !folder.folderDialog && (
          <ErrorMessage>{folder.folderError}</ErrorMessage>
        )}
        {view.savedDiagramCount > 0 && (
          <LibraryToolbar
            searchQuery={filters.searchQuery}
            onSearchQueryChange={filters.setSearchQuery}
            sortOrder={filters.sortOrder}
            onSortOrderChange={filters.setSortOrder}
            visibleDiagramCount={view.visibleDiagramCount}
          />
        )}
        {view.showsFolders && folders && (
          <FolderGrid
            folders={folders}
            diagrams={view.ownDiagrams}
            onRename={folder.requestFolderRename}
            onDelete={folder.requestFolderDeletion}
          />
        )}
        {ownerId ? (
          <SignedInDiagramSections
            accountDiagrams={view.shownOwnDiagrams}
            guestDiagrams={view.visibleGuestDiagrams}
            hasGuestDiagrams={(view.visibleGuestDiagrams?.length ?? 0) > 0}
            cloudPullStatus={cloudPullStatus}
            accountEmptyState={emptyState}
            cardActions={cardActions}
            guestCardActions={{ ...cardActions, folders: [] }}
            onMoveGuestDiagrams={openGuestMigration}
          />
        ) : (
          <DiagramGrid
            diagrams={view.shownOwnDiagrams}
            emptyState={emptyState}
            cardActions={cardActions}
          />
        )}
      </main>
      <LibraryDialogs
        isTemplatePickerOpen={isTemplatePickerOpen}
        onTemplateChosen={(template) => void startDiagramFromTemplate(template)}
        onCloseTemplatePicker={closeTemplatePicker}
        guestMigrationOwnerId={isGuestMigrationOpen ? ownerId : null}
        guestDiagrams={guestDiagrams}
        onCloseGuestMigration={closeGuestMigration}
        deletion={deletion}
        folder={folder}
        ownDiagrams={view.ownDiagrams}
      />
    </div>
  )
}
