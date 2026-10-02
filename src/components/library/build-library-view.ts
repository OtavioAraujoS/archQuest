import { diagramsInFolderView } from '@/components/library/library-view'
import type { LibraryViewInputs } from '@/types/library'

export function emptyLibraryMessage(
  isSignedIn: boolean,
  isInsideFolder: boolean,
) {
  if (isInsideFolder) {
    return 'Crie um diagrama aqui ou mova um existente pelo menu ⋯ de cada card.'
  }
  return isSignedIn
    ? 'Nenhum diagrama na sua conta ainda. Crie o primeiro para começar.'
    : 'Nenhum diagrama ainda. Crie o primeiro para começar a modelar um processo.'
}

export function buildLibraryView({
  ownerId,
  accountDiagrams,
  guestDiagrams,
  folders,
  currentFolderId,
  isOpeningFolder,
  isSearching,
  applyFilters,
}: LibraryViewInputs) {
  const ownDiagrams = ownerId ? accountDiagrams : guestDiagrams
  const visibleOwnDiagrams = applyFilters(
    diagramsInFolderView(ownDiagrams, folders, currentFolderId, isSearching),
  )
  const showsGuestSection = ownerId !== null && !currentFolderId
  const visibleGuestDiagrams = showsGuestSection
    ? applyFilters(guestDiagrams)
    : []
  const showsFolders = !isOpeningFolder && !currentFolderId && !isSearching

  return {
    ownDiagrams,
    shownOwnDiagrams: isOpeningFolder ? undefined : visibleOwnDiagrams,
    visibleGuestDiagrams,
    savedDiagramCount:
      (ownerId ? (accountDiagrams?.length ?? 0) : 0) +
      (guestDiagrams?.length ?? 0),
    visibleDiagramCount:
      (visibleOwnDiagrams?.length ?? 0) +
      (ownerId ? (visibleGuestDiagrams?.length ?? 0) : 0),
    showsFolders,
    hidesEmptyState: showsFolders && (folders?.length ?? 0) > 0,
  }
}
