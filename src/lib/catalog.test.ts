import { describe, expect, it } from 'vitest'
import { buildCatalog, emptyStateEntry, visibleEntries } from 'lib/catalog'
import { translations } from 'locales'

const catalog = buildCatalog(translations.pt)

describe('catálogo do Spotlight', () => {
  it('sem busca mostra perguntas, seções e comandos, nessa ordem', () => {
    const groups = visibleEntries(catalog, '').map((entry) => entry.group)
    expect([...new Set(groups)]).toEqual(['questions', 'goTo', 'actions'])
  })

  it('projetos, cargos e tecnologias só aparecem buscando', () => {
    expect(
      visibleEntries(catalog, '').some((entry) => entry.group === 'content')
    ).toBe(false)
    expect(
      visibleEntries(catalog, 'react').some(
        (entry) => entry.title === 'React' && entry.group === 'content'
      )
    ).toBe(true)
  })

  it('"testes" leva primeiro à pergunta de qualidade', () => {
    expect(visibleEntries(catalog, 'testes')[0].action).toEqual({
      kind: 'answer',
      questionId: 'quality'
    })
  })

  it('perguntas livres casam por palavra-chave', () => {
    expect(visibleEntries(catalog, 'você trabalha com IA?')[0].action).toEqual({
      kind: 'answer',
      questionId: 'ai'
    })
  })

  it('comandos casam pelo título', () => {
    expect(visibleEntries(catalog, 'copiar')[0].action).toEqual({
      kind: 'copyEmail'
    })
    expect(visibleEntries(catalog, 'inspecionar')[0].action).toEqual({
      kind: 'toggleInspector'
    })
  })

  it('ids são únicos', () => {
    for (const locale of Object.values(translations)) {
      const ids = buildCatalog(locale).map((entry) => entry.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('links externos são https', () => {
    for (const locale of Object.values(translations)) {
      for (const entry of buildCatalog(locale)) {
        if (entry.action.kind === 'openUrl')
          expect(entry.action.url).toMatch(/^https:\/\//)
      }
    }
  })

  it('estado vazio oferece copiar o e-mail', () => {
    expect(
      emptyStateEntry(translations.pt.spotlight, translations.pt.contact.email)
    ).toMatchObject({
      title: 'Copiar e-mail',
      subtitle: 'brunoluisbahiense@gmail.com',
      action: { kind: 'copyEmail' }
    })
  })
})
