import { describe, expect, it } from 'vitest'
import { translations } from 'locales'

function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shapeOf)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
        .map(([key, item]) => [key, shapeOf(item)])
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
