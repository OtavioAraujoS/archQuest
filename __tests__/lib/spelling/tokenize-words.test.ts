import { describe, expect, it } from 'vitest'

import { tokenizeWords } from '@/lib/spelling/tokenize-words'

function wordsOf(text: string) {
  return tokenizeWords(text).map((token) => token.word)
}

describe('tokenizeWords', () => {
  it('reports each word with its offsets in the text', () => {
    expect(tokenizeWords('Enviar pedido')).toEqual([
      { word: 'Enviar', start: 0, end: 6 },
      { word: 'pedido', start: 7, end: 13 },
    ])
  })

  it('keeps accented letters inside the word', () => {
    expect(wordsOf('Aprovação do crédito')).toEqual([
      'Aprovação',
      'do',
      'crédito',
    ])
  })

  it('keeps hyphenated and apostrophed compounds as one word', () => {
    expect(wordsOf("bem-vindo à caixa d'água")).toEqual([
      'bem-vindo',
      'caixa',
      "d'água",
    ])
  })

  it('leaves surrounding punctuation out of the word', () => {
    expect(tokenizeWords('Pedido recebido?')).toContainEqual({
      word: 'recebido',
      start: 7,
      end: 15,
    })
  })

  it('checks both sides of a slash', () => {
    expect(wordsOf('entrada/saída')).toEqual(['entrada', 'saída'])
  })

  it('finds words on every line', () => {
    expect(tokenizeWords('Analisar\npedido')).toEqual([
      { word: 'Analisar', start: 0, end: 8 },
      { word: 'pedido', start: 9, end: 15 },
    ])
  })

  it('skips single letters', () => {
    expect(wordsOf('e a tarefa')).toEqual(['tarefa'])
  })

  it('skips acronyms written in capitals', () => {
    expect(wordsOf('Emitir NF para o RH')).toEqual(['Emitir', 'para'])
  })

  it('skips names with an inner capital letter', () => {
    expect(wordsOf('Abrir archQuest')).toEqual(['Abrir'])
  })

  it('skips chunks that carry digits', () => {
    expect(wordsOf('Aguardar 10h etapa2')).toEqual(['Aguardar'])
  })

  it('skips e-mail addresses, links and file names', () => {
    expect(
      wordsOf('Enviar para ana@empresa.com via https://site.com relatorio.pdf'),
    ).toEqual(['Enviar', 'para', 'via'])
  })

  it('skips accepted business terms', () => {
    expect(wordsOf('Enviar email com Checklist')).toEqual(['Enviar', 'com'])
  })

  it('finds nothing in empty text', () => {
    expect(tokenizeWords('   ')).toEqual([])
  })
})
