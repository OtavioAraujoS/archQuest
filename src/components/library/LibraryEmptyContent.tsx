import { emptyLibraryMessage } from '@/components/library/build-library-view'
import { LibraryEmptyState } from '@/components/library/LibraryEmptyState'
import { NoSearchResults } from '@/components/library/NoSearchResults'

interface LibraryEmptyContentProps {
  isSearching: boolean
  searchQuery: string
  onClearSearch: () => void
  isSignedIn: boolean
  isInsideFolder: boolean
  onStartBlankDiagram: () => void
  onBrowseTemplates: () => void
}

export function LibraryEmptyContent({
  isSearching,
  searchQuery,
  onClearSearch,
  isSignedIn,
  isInsideFolder,
  onStartBlankDiagram,
  onBrowseTemplates,
}: Readonly<LibraryEmptyContentProps>) {
  if (isSearching) {
    return (
      <NoSearchResults
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
      />
    )
  }
  return (
    <LibraryEmptyState
      title={isInsideFolder ? 'Esta pasta está vazia' : undefined}
      message={emptyLibraryMessage(isSignedIn, isInsideFolder)}
      onStartBlankDiagram={onStartBlankDiagram}
      onBrowseTemplates={onBrowseTemplates}
    />
  )
}
