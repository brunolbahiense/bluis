import { describe, expect, it } from 'vitest'
import {
  normalize,
  scoreEntry,
  searchEntries,
  type SearchEntry
} from 'lib/search'

const entry = (
  id: string,
  title: string,
  extra: Partial<SearchEntry> = {}
): SearchEntry => ({
  id,
  title,
  ...extra
})

describe('normalize', () => {
  it('remove acentos, caixa e espaços nas pontas', () => {
    expect(normalize('  Automação ÉPICA ')).toBe('automacao epica')
  })
})

describe('scoreEntry', () => {
  it('começo do nome vale mais que começo de palavra, que vale mais que meio', () => {
    const nameStart = scoreEntry(entry('a', 'Experiência'), 'exp')
    const wordStart = scoreEntry(entry('b', 'Minha experiência'), 'exp')
    const middle = scoreEntry(entry('c', 'Inexperiente'), 'exp')
    expect(nameStart).toBeGreaterThan(wordStart)
    expect(wordStart).toBeGreaterThan(middle)
    expect(middle).toBeGreaterThan(0)
  })

  it('ignora acento e caixa', () => {
    expect(scoreEntry(entry('a', 'Automação'), 'AUTOMACAO')).toBeGreaterThan(0)
  })

  it('palavra-chave conta como começo do nome, mesmo no meio de uma frase', () => {
    const question = entry('q', 'Como você garante qualidade?', {
      keywords: ['testes', 'review']
    })
    expect(scoreEntry(question, 'você faz testes a/b?')).toBe(
      scoreEntry(entry('x', 'Testes'), 'testes')
    )
  })

  it('palavra-chave aceita digitação parcial a partir de 3 letras', () => {
    const question = entry('q', 'Como você assegura qualidade?', {
      keywords: ['testes']
    })
    expect(scoreEntry(question, 'tes')).toBeGreaterThan(0)
    expect(scoreEntry(question, 'te')).toBe(0)
  })

  it('procura também no subtítulo, como trecho', () => {
    const copyEmail = entry('a', 'Copiar e-mail', {
      subtitle: 'brunoluisbahiense@gmail.com'
    })
    expect(scoreEntry(copyEmail, 'gmail')).toBeGreaterThan(0)
  })

  it('retorna zero quando nada casa', () => {
    expect(scoreEntry(entry('a', 'Projetos'), 'kubernetes')).toBe(0)
  })
})

describe('searchEntries', () => {
  const catalog = [
    entry('1', 'Inexperiente'),
    entry('2', 'Minha experiência'),
    entry('3', 'Experiência'),
    entry('4', 'Projetos')
  ]

  it('sem busca devolve o catálogo na ordem original', () => {
    expect(searchEntries(catalog, '  ').map((item) => item.id)).toEqual([
      '1',
      '2',
      '3',
      '4'
    ])
  })

  it('ordena por pontuação e remove o que não casa', () => {
    expect(searchEntries(catalog, 'exp').map((item) => item.id)).toEqual([
      '3',
      '2',
      '1'
    ])
  })

  it('empate preserva a ordem do catálogo', () => {
    const tied = [entry('a', 'Stack de dados'), entry('b', 'Stack de front')]
    expect(searchEntries(tied, 'stack').map((item) => item.id)).toEqual([
      'a',
      'b'
    ])
  })

  it('devolve lista vazia quando nada casa', () => {
    expect(searchEntries(catalog, 'zzz')).toEqual([])
  })
})
