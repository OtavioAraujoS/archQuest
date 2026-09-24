export type Entry = {
  className: string
  title: string
  group: string
  action: {
    click: (event: Event) => void
    dragstart: (event: Event) => void
  }
}

export type TypeOfGateway =
  | 'Exclusivo'
  | 'Paralelo'
  | 'Inclusivo'
  | 'Baseado em eventos'
  | 'Complexo'
