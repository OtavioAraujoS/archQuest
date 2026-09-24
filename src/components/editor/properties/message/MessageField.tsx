import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'

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
      <NativeSelect
        size="sm"
        aria-label="Mensagem do evento"
        value={selectedMessageId}
        onChange={(event) => selectMessage(event.target.value)}
      >
        <option value={NO_MESSAGE}>Nenhuma</option>
        {definedMessages.map((message) => (
          <option key={message.id} value={message.id}>
            {messageDisplayName(message)}
          </option>
        ))}
      </NativeSelect>
      <form
        className="flex gap-1"
        onSubmit={(event) => {
          event.preventDefault()
          createMessage()
        }}
      >
        <Input
          size="sm"
          aria-label="Nome da nova mensagem"
          placeholder="Nova mensagem"
          value={newMessageName}
          onChange={(event) => setNewMessageName(event.target.value)}
          className="min-w-0 flex-1"
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
