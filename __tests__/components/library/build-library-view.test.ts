import { describe, expect, it } from 'vitest'

import { buildLibraryView } from '@/components/library/build-library-view'
import {
  countDiagramsInFolder,
  diagramsInFolderView,
} from '@/components/library/library-view'
import type { DiagramRecord } from '@/lib/db'
import { makeGuestDiagram, OWNER_ID } from '../../lib/diagrams/diagram-fixtures'
import { makeGuestFolder } from '../../lib/folders/folder-fixtures'

const folder = makeGuestFolder({ id: 'folder-1' })
const looseDiagram = makeGuestDiagram({ id: 'loose' })
const filedDiagram = makeGuestDiagram({ id: 'filed', folderId: 'folder-1' })
const orphanDiagram = makeGuestDiagram({ id: 'orphan', folderId: 'gone' })
const diagrams = [looseDiagram, filedDiagram, orphanDiagram]
const keepAll = (list: DiagramRecord[] | undefined) => list

function idsOf(list: DiagramRecord[] | undefined) {
  return list?.map((diagram) => diagram.id)
}

describe('library view', () => {
  it('shows only the diagrams outside folders at the root', () => {
    expect(
      idsOf(diagramsInFolderView(diagrams, [folder], null, false)),
    ).toEqual(['loose', 'orphan'])
  })

  it('shows only the diagrams of the open folder', () => {
    expect(
      idsOf(diagramsInFolderView(diagrams, [folder], 'folder-1', false)),
    ).toEqual(['filed'])
  })

  it('searches every diagram from the root', () => {
    expect(idsOf(diagramsInFolderView(diagrams, [folder], null, true))).toEqual(
      ['loose', 'filed', 'orphan'],
    )
  })

  it('waits for the folders before listing', () => {
    expect(
      diagramsInFolderView(diagrams, undefined, null, false),
    ).toBeUndefined()
  })

  it('counts the diagrams of a folder', () => {
    expect(countDiagramsInFolder(diagrams, 'folder-1')).toBe(1)
  })

  it('hides the empty state at a root that has folders', () => {
    const view = buildLibraryView({
      ownerId: null,
      accountDiagrams: [],
      guestDiagrams: [filedDiagram],
      folders: [folder],
      currentFolderId: null,
      isOpeningFolder: false,
      isSearching: false,
      applyFilters: keepAll,
    })

    expect(view).toMatchObject({
      showsFolders: true,
      hidesEmptyState: true,
      savedDiagramCount: 1,
      visibleDiagramCount: 0,
    })
  })

  it('keeps the browser-only section out of a folder', () => {
    const view = buildLibraryView({
      ownerId: OWNER_ID,
      accountDiagrams: [],
      guestDiagrams: [looseDiagram],
      folders: [folder],
      currentFolderId: 'folder-1',
      isOpeningFolder: false,
      isSearching: false,
      applyFilters: keepAll,
    })

    expect(view.visibleGuestDiagrams).toEqual([])
    expect(view.showsFolders).toBe(false)
  })
})
