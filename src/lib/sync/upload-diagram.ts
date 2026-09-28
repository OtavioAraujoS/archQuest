import { db, type DiagramRecord } from '@/lib/db'
import {
  insertCloudDiagram,
  updateCloudDiagramAtVersion,
} from '@/lib/diagrams/cloud-diagram-writes'
import { markDiagramUploaded } from '@/lib/diagrams/mark-diagram-uploaded'
import { exceedsCloudSizeLimit } from '@/lib/sync/cloud-size-limit'

export type UploadOutcome = 'uploaded' | 'conflict' | 'too-large'

function cloudThumbnailFor(diagram: DiagramRecord) {
  if (!diagram.thumbnail || exceedsCloudSizeLimit(diagram.thumbnail))
    return null
  return diagram.thumbnail
}

async function cloudFolderIdFor(diagram: DiagramRecord) {
  if (!diagram.folderId) return null
  const folder = await db.folders.get(diagram.folderId)
  return folder?.ownerId === diagram.ownerId ? folder.id : null
}

async function uploadToCloud(diagram: DiagramRecord) {
  const content = {
    name: diagram.name,
    bpmn_xml: diagram.bpmnXml,
    thumbnail: cloudThumbnailFor(diagram),
    folder_id: await cloudFolderIdFor(diagram),
  }
  if (diagram.version === 0) {
    return insertCloudDiagram({
      id: diagram.id,
      ...content,
      created_at: new Date(diagram.createdAt).toISOString(),
      updated_at: new Date(diagram.updatedAt).toISOString(),
    })
  }
  return updateCloudDiagramAtVersion(diagram.id, diagram.version, content)
}

export async function uploadDiagram(
  diagram: DiagramRecord,
): Promise<UploadOutcome> {
  if (exceedsCloudSizeLimit(diagram.bpmnXml)) return 'too-large'
  const cloudRow = await uploadToCloud(diagram)
  if (!cloudRow) return 'conflict'
  await markDiagramUploaded(diagram, cloudRow)
  return 'uploaded'
}
