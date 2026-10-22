import { describe, expect, it } from 'vitest'
import { chooseLocale, isLocale, localeFromPath, otherLocale } from 'lib/locale'

describe('isLocale', () => {
  it('aceita só os idiomas suportados', () => {
    expect(isLocale('pt')).toBe(true)
    expect(isLocale('en')).toBe(true)
    expect(isLocale('fr')).toBe(false)
    expect(isLocale(undefined)).toBe(false)
  })
})

describe('localeFromPath', () => {
  it('lê o idioma do primeiro segmento', () => {
    expect(localeFromPath('/pt')).toBe('pt')
    expect(localeFromPath('/en/qualquer')).toBe('en')
  })

  it('retorna null sem prefixo de idioma', () => {
    expect(localeFromPath('/')).toBeNull()
    expect(localeFromPath('/portfolio')).toBeNull()
    expect(localeFromPath('/xx')).toBeNull()
  })
})

describe('chooseLocale', () => {
  it('prioriza o cookie válido', () => {
    expect(chooseLocale({ cookie: 'en', acceptLanguage: 'pt-BR' })).toBe('en')
  })

  it('ignora cookie inválido e usa o Accept-Language', () => {
    expect(
      chooseLocale({ cookie: 'fr', acceptLanguage: 'pt-BR,pt;q=0.9' })
    ).toBe('pt')
  })

  it('respeita a ordem de preferência por q', () => {
    expect(
      chooseLocale({ acceptLanguage: 'fr;q=0.9,en;q=0.8,pt;q=0.95' })
    ).toBe('pt')
  })

  it('usa inglês quando o navegador prefere um idioma não suportado', () => {
    expect(chooseLocale({ acceptLanguage: 'de-DE,de;q=0.9' })).toBe('en')
  })

  it('usa português sem cookie nem Accept-Language', () => {
    expect(chooseLocale({})).toBe('pt')
    expect(chooseLocale({ acceptLanguage: '' })).toBe('pt')
  })
})

describe('otherLocale', () => {
  it('alterna entre pt e en', () => {
    expect(otherLocale('pt')).toBe('en')
    expect(otherLocale('en')).toBe('pt')
  })
})
