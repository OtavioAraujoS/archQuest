import { beforeEach, describe, expect, it } from 'vitest'

import { BLANK_DIAGRAM_XML } from '@/lib/blank-diagram'
import { BLANK_DIAGRAM_NAME, createDiagram } from '@/lib/create-diagram'
import { db } from '@/lib/db'

describe('createDiagram', () => {
  beforeEach(async () => {
    await db.diagrams.clear()
  })

  it('stores a blank diagram by default and returns its id', async () => {
    const id = await createDiagram()

    const storedDiagram = await db.diagrams.get(id)
    expect(storedDiagram).toMatchObject({
      name: BLANK_DIAGRAM_NAME,
      bpmnXml: BLANK_DIAGRAM_XML,
    })
    expect(storedDiagram?.createdAt).toBe(storedDiagram?.updatedAt)
  })

  it('stores the given name and BPMN XML', async () => {
    const id = await createDiagram('Reembolso', '<bpmn:definitions />')

    await expect(db.diagrams.get(id)).resolves.toMatchObject({
      name: 'Reembolso',
      bpmnXml: '<bpmn:definitions />',
    })
  })

  it('gives every new diagram its own id', async () => {
    const firstId = await createDiagram()
    const secondId = await createDiagram()

    expect(firstId).not.toBe(secondId)
    await expect(db.diagrams.count()).resolves.toBe(2)
  })
})
