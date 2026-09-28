import {
  listPendingFolderUploads,
  markFolderUploaded,
} from '@/lib/folders/cached-folders'
import { upsertCloudFolder } from '@/lib/folders/cloud-folders'

export async function uploadPendingFolders(ownerId: string) {
  for (const folder of await listPendingFolderUploads(ownerId)) {
    await upsertCloudFolder(folder)
    await markFolderUploaded(folder)
  }
}
