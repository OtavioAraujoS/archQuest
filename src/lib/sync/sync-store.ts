import { create } from 'zustand'

export interface SyncState {
  isOnline: boolean
  isUploading: boolean
  lastUploadFailed: boolean
  tooLargeDiagramIds: string[]
  conflictedDiagramIds: string[]
}

export const INITIAL_SYNC_STATE: SyncState = {
  isOnline: true,
  isUploading: false,
  lastUploadFailed: false,
  tooLargeDiagramIds: [],
  conflictedDiagramIds: [],
}

export const useSyncStore = create<SyncState>(() => INITIAL_SYNC_STATE)
