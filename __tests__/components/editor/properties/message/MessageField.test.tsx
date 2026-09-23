import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { assignMessageToEvent, createMessageForEvent } from '@/components/editor/properties/message/message-commands'
import type {
  BpmnMessage,
  MessageEventDefinition,
} from '@/components/editor/properties/message/message-event-definition'
import { MessageField } from '@/components/editor/properties/message/MessageField'

vi.mock('@/components/editor/properties/message/message-commands', () => ({
  assignMessageToEvent: vi.fn(),
  createMessageForEvent: vi.fn(),
}))

function fakeBpmnMessage(id: string, name: string) {
  return {
    $type: 'bpmn:Message',
    $instanceOf: (type: string) => type === 'bpmn:Message',
    id,
    name,
  } as BpmnMessage
}

const eventShape = { id: 'Event_1' }
const orderReceived = fakeBpmnMessage('Message_order', 'Pedido recebido')
const paymentConfirmed = fakeBpmnMessage('Message_payment', 'Pagamento confirmado')

const services = {
  definitions: { rootElements: [orderReceived, paymentConfirmed] },
} as never

function renderMessageField(messageRef?: BpmnMessage) {
  const eventDefinition = {
    $type: 'bpmn:MessageEventDefinition',
    messageRef,
  } as MessageEventDefinition
  render(
    <MessageField
      services={services}
      element={eventShape}
      eventDefinition={eventDefinition}
    />,
  )
  return eventDefinition
}

describe('MessageField', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows the message currently assigned to the event', () => {
    renderMessageField(paymentConfirmed)

    expect(screen.getByLabelText('Mensagem do evento')).toHaveValue(
      'Message_payment',
    )
  })

  it('assigns an existing message when it is chosen', () => {
    const eventDefinition = renderMessageField()

    fireEvent.change(screen.getByLabelText('Mensagem do evento'), {
      target: { value: 'Message_order' },
    })

    expect(assignMessageToEvent).toHaveBeenCalledWith(
      services,
      eventShape,
      eventDefinition,
      orderReceived,
    )
  })

  it('clears the message when "Nenhuma" is chosen', () => {
    const eventDefinition = renderMessageField(orderReceived)

    fireEvent.change(screen.getByLabelText('Mensagem do evento'), {
      target: { value: '' },
    })

    expect(assignMessageToEvent).toHaveBeenCalledWith(
      services,
      eventShape,
      eventDefinition,
      undefined,
    )
  })

  it('creates a new message from the typed name', () => {
    const eventDefinition = renderMessageField()
    const nameInput = screen.getByLabelText('Nome da nova mensagem')

    fireEvent.change(nameInput, { target: { value: 'Nota fiscal emitida' } })
    fireEvent.click(screen.getByRole('button', { name: 'Criar mensagem' }))

    expect(createMessageForEvent).toHaveBeenCalledWith(
      services,
      eventShape,
      eventDefinition,
      'Nota fiscal emitida',
    )
    expect(nameInput).toHaveValue('')
  })

  it('does not allow creating a message without a name', () => {
    renderMessageField()

    expect(screen.getByRole('button', { name: 'Criar mensagem' })).toBeDisabled()
  })
})
