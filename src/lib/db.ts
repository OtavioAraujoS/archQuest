import Dexie, { type EntityTable } from "dexie";

export interface DiagramRecord {
  id: string;
  name: string;
  bpmnXml: string;
  thumbnail?: string;
  createdAt: number;
  updatedAt: number;
}

export const db = new Dexie("archquest") as Dexie & {
  diagrams: EntityTable<DiagramRecord, "id">;
};

db.version(1).stores({
  diagrams: "id, name, updatedAt",
});
