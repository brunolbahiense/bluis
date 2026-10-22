// Isolado de buildInfo.ts porque só este módulo lê o sistema de arquivos
// (node:fs): mantendo o acesso a disco fora do módulo puro, componentes de
// cliente que importam formatBuiltAt/BuildInfo não arrastam node:fs para o
// bundle do navegador, e o `server-only` barra qualquer import acidental
// a partir de um componente de cliente.
import 'server-only'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { developmentBuildInfo, type BuildInfo } from './buildInfo'

function isBuildInfo(value: unknown): value is BuildInfo {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<BuildInfo>
  return (
    typeof candidate.version === 'string' &&
    typeof candidate.commit === 'string' &&
    typeof candidate.builtAt === 'string' &&
    typeof candidate.tests?.passed === 'number' &&
    typeof candidate.tests?.total === 'number'
  )
}

export function readBuildInfo(path?: string): BuildInfo {
  try {
    // Chamada com o caminho literal em separado (em vez de um `??` com
    // `path`): assim o Turbopack consegue provar que o caso de produção é
    // estático e não precisa rastrear o projeto inteiro. O parâmetro só
    // existe para os testes apontarem para arquivos temporários.
    const raw = path
      ? readFileSync(path, 'utf8')
      : readFileSync(
          join(process.cwd(), 'src', 'generated', 'build-info.json'),
          'utf8'
        )
    const parsed: unknown = JSON.parse(raw)
    return isBuildInfo(parsed) ? parsed : developmentBuildInfo
  } catch {
    return developmentBuildInfo
  }
}
