import type { DiagramRecord } from '@/lib/db'
import {
  insertCloudDiagram,
  updateCloudDiagramAtVersion,
} from '@/lib/diagrams/cloud-diagram-writes'
import { markDiagramUploaded } from '@/lib/diagrams/mark-diagram-uploaded'
import { exceedsCloudSizeLimit } from '@/lib/sync/cloud-size-limit'

export type UploadOutcome = 'uploaded' | 'conflict' | 'too-large'

function cloudThumbnailFor(diagram: DiagramRecord) {
  if (!diagram.thumbnail || exceedsCloudSizeLimit(diagram.thumbnail)) return null
  return diagram.thumbnail
}

function uploadToCloud(diagram: DiagramRecord) {
  const content = {
    name: diagram.name,
    bpmn_xml: diagram.bpmnXml,
    thumbnail: cloudThumbnailFor(diagram),
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

export async function uploadDiagram(diagram: DiagramRecord): Promise<UploadOutcome> {
  if (exceedsCloudSizeLimit(diagram.bpmnXml)) return 'too-large'
  const cloudRow = await uploadToCloud(diagram)
  if (!cloudRow) return 'conflict'
  await markDiagramUploaded(diagram, cloudRow)
  return 'uploaded'
}
