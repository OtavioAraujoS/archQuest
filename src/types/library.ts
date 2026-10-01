import type { FolderRecord } from '@/lib/db'

export type CloudPullStatus = 'pulling' | 'pulled' | 'failed'

export type FolderDialog =
  | { kind: 'create' }
  | { kind: 'rename'; folder: FolderRecord }
  | { kind: 'delete'; folder: FolderRecord }
