import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

import {
  assignMessageToEvent,
  createMessageForEvent,
  type MessageCommandServices,
} from './message-commands'
import {
  listDefinedMessages,
  messageDisplayName,
  type MessageEventDefinition,
} from './message-event-definition'

const NO_MESSAGE = ''

interface MessageFieldProps {
  services: MessageCommandServices
  element: unknown
  eventDefinition: MessageEventDefinition
}

export function MessageField({
  services,
  element,
  eventDefinition,
}: Readonly<MessageFieldProps>) {
  const [newMessageName, setNewMessageName] = useState('')
  const definedMessages = listDefinedMessages(services.definitions)
  const selectedMessageId = eventDefinition.messageRef?.id ?? NO_MESSAGE

  function selectMessage(messageId: string) {
    const message = definedMessages.find(({ id }) => id === messageId)
    assignMessageToEvent(services, element, eventDefinition, message)
  }

  function createMessage() {
    if (!newMessageName.trim()) return
    createMessageForEvent(services, element, eventDefinition, newMessageName)
    setNewMessageName('')
  }

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-xs font-medium">Mensagem</legend>
      <select
        aria-label="Mensagem do evento"
        value={selectedMessageId}
        onChange={(event) => selectMessage(event.target.value)}
        className="bg-background h-8 rounded-md border px-2 text-sm"
      >
        <option value={NO_MESSAGE}>Nenhuma</option>
        {definedMessages.map((message) => (
          <option key={message.id} value={message.id}>
            {messageDisplayName(message)}
          </option>
        ))}
      </select>
      <form
        className="flex gap-1"
        onSubmit={(event) => {
          event.preventDefault()
          createMessage()
        }}
      >
        <input
          aria-label="Nome da nova mensagem"
          placeholder="Nova mensagem"
          value={newMessageName}
          onChange={(event) => setNewMessageName(event.target.value)}
          className="bg-background h-8 min-w-0 flex-1 rounded-md border px-2 text-sm"
        />
        <Button
          type="submit"
          size="icon"
          variant="outline"
          aria-label="Criar mensagem"
          disabled={!newMessageName.trim()}
        >
          <Plus />
        </Button>
      </form>
    </fieldset>
  )
}
