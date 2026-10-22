import { describe, expect, it } from 'vitest'
import { translations } from 'locales'

function shapeOf(value: unknown, key?: string): unknown {
  // keywords são termos de busca livres: cada idioma pode ter uma quantidade
  // diferente de sinônimos, então só comparamos a forma, não o tamanho
  if (key === 'keywords' && Array.isArray(value)) return 'string[]'
  if (Array.isArray(value)) return value.map((item) => shapeOf(item))
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
        .map(([entryKey, item]) => [entryKey, shapeOf(item, entryKey)])
    )
  }
  return typeof value
}

function emptyStringPaths(value: unknown, path = ''): string[] {
  if (typeof value === 'string') {
    // suffix é propositalmente vazio quando a métrica não tem countTo numérico
    if (path.endsWith('.suffix')) return []
    return value.trim() ? [] : [path]
  }
  if (Array.isArray(value))
    return value.flatMap((item, index) =>
      emptyStringPaths(item, `${path}[${index}]`)
    )
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) =>
      emptyStringPaths(item, path ? `${path}.${key}` : key)
    )
  }
  return []
}

describe('locales', () => {
  it('pt e en têm a mesma estrutura, as mesmas chaves e o mesmo tamanho de listas', () => {
    expect(shapeOf(translations.en)).toEqual(shapeOf(translations.pt))
  })

  it('não têm texto vazio', () => {
    expect(emptyStringPaths(translations.pt)).toEqual([])
    expect(emptyStringPaths(translations.en)).toEqual([])
  })

  it('métricas com contagem têm sufixo', () => {
    for (const locale of [translations.pt, translations.en]) {
      for (const item of locale.metrics.items) {
        if (item.countTo !== null) expect(item.suffix.trim()).not.toBe('')
      }
    }
  })

  it('cada idioma declara o próprio locale', () => {
    expect(translations.pt.locale).toBe('pt')
    expect(translations.en.locale).toBe('en')
  })

  it('perguntas frequentes têm ids únicos e iguais nos dois idiomas', () => {
    const portugueseIds = translations.pt.spotlight.questions.map(
      (question) => question.id
    )
    const englishIds = translations.en.spotlight.questions.map(
      (question) => question.id
    )
    expect(new Set(portugueseIds).size).toBe(portugueseIds.length)
    expect(englishIds).toEqual(portugueseIds)
  })

  it('o template de testes do Inspector tem os dois marcadores', () => {
    for (const locale of [translations.pt, translations.en]) {
      expect(locale.inspector.testsValue).toContain('{passed}')
      expect(locale.inspector.testsValue).toContain('{total}')
    }
  })
})
