const PRINCIPLES = [
  {
    title: 'BPMN 2.0 de verdade',
    detail:
      'Eventos, gateways, tarefas e sub-processos seguem a especificação. O arquivo .bpmn abre em qualquer ferramenta compatível.',
  },
  {
    title: 'Sem conta para começar',
    detail:
      'Tudo roda no navegador e fica salvo neste dispositivo. Entre na sua conta só se quiser sincronizar.',
  },
  {
    title: 'Paleta que cabe na cabeça',
    detail:
      'Elementos agrupados por família e um painel de propriedades direto, no ritmo de um quadro branco.',
  },
  {
    title: 'Código aberto, licença MIT',
    detail:
      'Sem aprisionamento: o código e as decisões de arquitetura estão publicados para quem quiser ler ou contribuir.',
  },
]

export function PrinciplesSection() {
  return (
    <section aria-labelledby="principles-title" className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[18rem_1fr]">
        <h2
          id="principles-title"
          className="font-display text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl"
        >
          Feito para quem mapeia processos
        </h2>
        <dl className="grid gap-x-10 sm:grid-cols-2">
          {PRINCIPLES.map((principle) => (
            <div
              key={principle.title}
              className="border-t py-6 first:border-t-0 sm:nth-2:border-t-0"
            >
              <dt className="font-medium">{principle.title}</dt>
              <dd className="text-muted-foreground mt-2 leading-relaxed text-pretty">
                {principle.detail}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
