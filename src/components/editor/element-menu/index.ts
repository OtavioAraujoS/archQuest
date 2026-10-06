import ContextPadNearPointer from './ContextPadNearPointer'
import ElementMenuContextPadProvider from './ElementMenuContextPadProvider'

export default {
  __init__: ['elementMenuContextPadProvider', 'contextPadNearPointer'],
  elementMenuContextPadProvider: ['type', ElementMenuContextPadProvider],
  contextPadNearPointer: ['type', ContextPadNearPointer],
}
