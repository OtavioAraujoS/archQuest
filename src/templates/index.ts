import purchaseApprovalXml from './aprovacao-de-compra.bpmn?raw'
import customerSupportXml from './atendimento-ao-cliente.bpmn?raw'
import employeeOnboardingXml from './onboarding-de-funcionario.bpmn?raw'
import blankProcessWithLanesXml from './processo-em-branco-com-raias.bpmn?raw'
import expenseReimbursementXml from './reembolso-de-despesas.bpmn?raw'

export interface DiagramTemplate {
  id: string
  name: string
  description: string
  xml: string
}

export const DIAGRAM_TEMPLATES: DiagramTemplate[] = [
  {
    id: 'aprovacao-de-compra',
    name: 'Aprovação de compra',
    description: 'Solicitação aprovada pelo gestor ou pela diretoria conforme o valor.',
    xml: purchaseApprovalXml,
  },
  {
    id: 'onboarding-de-funcionario',
    name: 'Onboarding de funcionário',
    description: 'RH, TI e gestor preparam a chegada do novo colaborador em paralelo.',
    xml: employeeOnboardingXml,
  },
  {
    id: 'atendimento-ao-cliente',
    name: 'Atendimento ao cliente',
    description: 'Chamado recebido por mensagem, com pedido de informações ao cliente.',
    xml: customerSupportXml,
  },
  {
    id: 'reembolso-de-despesas',
    name: 'Reembolso de despesas',
    description: 'Aprovação com prazo de 3 dias; sem resposta, o pedido é escalado.',
    xml: expenseReimbursementXml,
  },
  {
    id: 'processo-em-branco-com-raias',
    name: 'Processo em branco com raias',
    description: 'Um pool com duas raias, pronto para você desenhar o seu processo.',
    xml: blankProcessWithLanesXml,
  },
]
