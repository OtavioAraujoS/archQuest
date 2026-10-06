import type {
  BpmnFactoryService,
  CommandStackService,
  ModelingService,
} from '@/types/diagram-js-services'

export interface BpmnMessage {
  $type: 'bpmn:Message'
  id: string
  name?: string
}

export interface MessageEventDefinition {
  $type: 'bpmn:MessageEventDefinition'
  messageRef?: BpmnMessage
}

export interface BpmnDefinitions {
  rootElements?: { $type: string }[]
}

export interface CreateAndAssignMessageContext {
  element: unknown
  definitions: BpmnDefinitions
  eventDefinition: MessageEventDefinition
  message: BpmnMessage
}

export type TimerKind = 'timeDate' | 'timeDuration' | 'timeCycle'

export interface FormalExpression {
  $type: 'bpmn:FormalExpression'
  $parent?: unknown
  body?: string
}

export type TimerEventDefinition = {
  $type: 'bpmn:TimerEventDefinition'
} & Partial<Record<TimerKind, FormalExpression>>

export interface TimerExpression {
  kind: TimerKind
  isoExpression: string
}

export type DurationUnit = 'minutes' | 'hours' | 'days' | 'weeks'

export interface TimerDuration {
  amount: number
  unit: DurationUnit
}

export interface TimerCycle {
  repetitions?: number
  interval: TimerDuration
}

export interface TimerCommandServices {
  modeling: ModelingService
  bpmnFactory: BpmnFactoryService
}

export interface MessageCommandServices extends TimerCommandServices {
  commandStack: CommandStackService
  definitions: BpmnDefinitions
}

export type PropertyEditingServices = MessageCommandServices
