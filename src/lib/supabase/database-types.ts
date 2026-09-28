export type DiagramRow = {
  id: string
  owner_id: string
  name: string
  bpmn_xml: string
  thumbnail: string | null
  version: number
  public_slug: string | null
  folder_id: string | null
  created_at: string
  updated_at: string
}

export type DiagramInsert = {
  id?: string
  owner_id?: string
  name: string
  bpmn_xml: string
  thumbnail?: string | null
  public_slug?: string | null
  folder_id?: string | null
  created_at?: string
  updated_at?: string
}

export type DiagramUpdate = Partial<Omit<DiagramInsert, 'id' | 'owner_id'>>

export type FolderRow = {
  id: string
  owner_id: string
  name: string
  created_at: string
  updated_at: string
}

export type FolderUpsert = Pick<
  FolderRow,
  'id' | 'name' | 'created_at' | 'updated_at'
>

export type PublicDiagram = Pick<DiagramRow, 'name' | 'bpmn_xml' | 'updated_at'>

export type Database = {
  public: {
    Tables: {
      diagrams: {
        Row: DiagramRow
        Insert: DiagramInsert
        Update: DiagramUpdate
        Relationships: []
      }
      diagram_folders: {
        Row: FolderRow
        Insert: FolderUpsert
        Update: Partial<FolderUpsert>
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: {
      get_public_diagram: {
        Args: { requested_slug: string }
        Returns: PublicDiagram[]
      }
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}
