import {
  findEnclosingSubProcess,
  findPool,
  isOfType,
  type DiagramElement,
} from '@/lib/bpmn/diagram-element-ancestry'

export const REFUSED_CONNECTION_REASONS = {
  gatewaySendsToOtherPool:
    'Setas sólidas não ligam pools diferentes, e gateways não enviam mensagens. Coloque as etapas em raias do mesmo pool ou envie a mensagem a partir de uma tarefa.',
  gatewayReceivesFromOtherPool:
    'Gateways não recebem mensagens de outro pool. Ligue a mensagem a uma tarefa ou a um evento de mensagem.',
  acrossPools:
    'Setas sólidas não ligam pools diferentes. Coloque as etapas em raias do mesmo pool ou use um fluxo de mensagem entre tarefas.',
  acrossSubProcessBorder:
    'Setas sólidas não atravessam a borda de um subprocesso. Ligue a seta ao próprio subprocesso ou a um elemento do mesmo nível.',
  fromEndEvent:
    'Um evento de fim encerra o fluxo e não pode ter setas de saída.',
  toStartEvent: 'Um evento de início abre o fluxo e não pode receber setas.',
  notAllowed: 'Essa ligação não é permitida pelo padrão BPMN.',
} as const

function describeRefusedMessageFlow(
  source: DiagramElement,
  target: DiagramElement,
) {
  if (isOfType(source, 'bpmn:Gateway')) {
    return REFUSED_CONNECTION_REASONS.gatewaySendsToOtherPool
  }
  if (isOfType(target, 'bpmn:Gateway')) {
    return REFUSED_CONNECTION_REASONS.gatewayReceivesFromOtherPool
  }
  return REFUSED_CONNECTION_REASONS.acrossPools
}

export function describeRefusedConnection(
  source: DiagramElement,
  target: DiagramElement,
) {
  if (findPool(source) !== findPool(target)) {
    return describeRefusedMessageFlow(source, target)
  }
  if (findEnclosingSubProcess(source) !== findEnclosingSubProcess(target)) {
    return REFUSED_CONNECTION_REASONS.acrossSubProcessBorder
  }
  if (isOfType(source, 'bpmn:EndEvent')) {
    return REFUSED_CONNECTION_REASONS.fromEndEvent
  }
  if (isOfType(target, 'bpmn:StartEvent')) {
    return REFUSED_CONNECTION_REASONS.toStartEvent
  }
  return REFUSED_CONNECTION_REASONS.notAllowed
}
