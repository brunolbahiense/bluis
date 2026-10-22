import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  copyrightYear,
  developmentBuildInfo,
  formatBuiltAt,
  readBuildInfo
} from 'lib/buildInfo'

const directory = mkdtempSync(join(tmpdir(), 'build-info-'))

describe('readBuildInfo', () => {
  it('usa os valores de desenvolvimento quando o arquivo não existe', () => {
    expect(readBuildInfo(join(directory, 'nao-existe.json'))).toEqual(
      developmentBuildInfo
    )
  })

  it('lê um arquivo válido', () => {
    const path = join(directory, 'valido.json')
    const info = {
      version: '2.0.0',
      commit: 'abc1234',
      builtAt: '2026-10-21T12:00:00.000Z',
      tests: { passed: 40, total: 40 }
    }
    writeFileSync(path, JSON.stringify(info))
    expect(readBuildInfo(path)).toEqual(info)
  })

  it('usa os valores de desenvolvimento quando o JSON é inválido ou incompleto', () => {
    const invalidPath = join(directory, 'invalido.json')
    writeFileSync(invalidPath, '{ não é json')
    expect(readBuildInfo(invalidPath)).toEqual(developmentBuildInfo)

    const incompletePath = join(directory, 'incompleto.json')
    writeFileSync(incompletePath, JSON.stringify({ version: '2.0.0' }))
    expect(readBuildInfo(incompletePath)).toEqual(developmentBuildInfo)
  })
})

describe('formatBuiltAt', () => {
  it('formata datas ISO no idioma da página', () => {
    expect(formatBuiltAt('2026-10-21T12:00:00.000Z', 'pt-BR')).toMatch(/2026/)
  })

  it('devolve o texto original quando não é data', () => {
    expect(formatBuiltAt('dev', 'pt-BR')).toBe('dev')
  })
})

describe('copyrightYear', () => {
  it('usa o ano do build', () => {
    expect(
      copyrightYear({
        ...developmentBuildInfo,
        builtAt: '2026-10-21T12:00:00.000Z'
      })
    ).toBe(2026)
  })
})
