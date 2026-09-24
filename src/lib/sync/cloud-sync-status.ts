import type { DiagramRecord } from '@/lib/db'
import type { SyncState } from '@/lib/sync/sync-store'

export type CloudSyncTone = 'saved' | 'saving' | 'warning' | 'error'

export interface CloudSyncStatus {
  tone: CloudSyncTone
  label: string
  detail?: string
}

export function describeCloudSyncStatus(
  diagram: DiagramRecord | undefined,
  syncState: SyncState,
): CloudSyncStatus | null {
  if (!diagram || diagram.ownerId === null) return null

  if (syncState.tooLargeDiagramIds.includes(diagram.id)) {
    return {
      tone: 'error',
      label: 'Grande demais para a nuvem',
      detail:
        'O XML passou de 2 MB. As alterações ficam salvas neste navegador, mas não vão para a nuvem até o diagrama diminuir.',
    }
  }
  if (syncState.conflictedDiagramIds.includes(diagram.id)) {
    return {
      tone: 'error',
      label: 'Conflito com a nuvem',
      detail: 'Outra aba ou dispositivo salvou este diagrama antes.',
    }
  }
  if (!diagram.dirty) return { tone: 'saved', label: 'Salvo na nuvem' }
  if (!syncState.isOnline) return { tone: 'warning', label: 'Offline — alterações pendentes' }
  if (syncState.lastUploadFailed && !syncState.isUploading) {
    return {
      tone: 'warning',
      label: 'Erro ao salvar — tentando de novo',
      detail: 'As alterações estão salvas neste navegador e vão para a nuvem na próxima tentativa.',
    }
  }
  return { tone: 'saving', label: 'Salvando…' }
}
