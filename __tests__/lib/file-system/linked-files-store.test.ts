import { beforeEach, describe, expect, it } from 'vitest'

import {
  linkDiagramToFile,
  linkedFileOf,
  unlinkDiagramFromFile,
  useLinkedFilesStore,
} from '@/lib/file-system/linked-files-store'
import { createFakeFileHandle } from './fake-file-handle'

describe('linked files', () => {
  beforeEach(() => {
    useLinkedFilesStore.setState({ fileHandlesByDiagramId: {} })
  })

  it('remembers the file linked to each diagram during the session', () => {
    const { handle: purchaseFile } = createFakeFileHandle({ fileName: 'Compras.bpmn' })
    const { handle: onboardingFile } = createFakeFileHandle({ fileName: 'Onboarding.bpmn' })

    linkDiagramToFile('purchase', purchaseFile)
    linkDiagramToFile('onboarding', onboardingFile)

    expect(linkedFileOf('purchase')).toBe(purchaseFile)
    expect(linkedFileOf('onboarding')).toBe(onboardingFile)
    expect(linkedFileOf('unknown')).toBeUndefined()
  })

  it('replaces the link when the diagram is saved to another file', () => {
    const { handle: firstFile } = createFakeFileHandle({ fileName: 'v1.bpmn' })
    const { handle: secondFile } = createFakeFileHandle({ fileName: 'v2.bpmn' })

    linkDiagramToFile('purchase', firstFile)
    linkDiagramToFile('purchase', secondFile)

    expect(linkedFileOf('purchase')).toBe(secondFile)
  })

  it('forgets only the unlinked diagram', () => {
    const { handle } = createFakeFileHandle()
    linkDiagramToFile('purchase', handle)
    linkDiagramToFile('onboarding', handle)

    unlinkDiagramFromFile('purchase')

    expect(linkedFileOf('purchase')).toBeUndefined()
    expect(linkedFileOf('onboarding')).toBe(handle)
  })
})
