import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export type BuildInfo = {
  version: string
  commit: string
  builtAt: string
  tests: { passed: number; total: number }
}

export const developmentBuildInfo: BuildInfo = {
  version: 'dev',
  commit: 'local',
  builtAt: 'dev',
  tests: { passed: 0, total: 0 }
}

const buildInfoPath = join(process.cwd(), 'src', 'generated', 'build-info.json')

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

export function readBuildInfo(path = buildInfoPath): BuildInfo {
  try {
    const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'))
    return isBuildInfo(parsed) ? parsed : developmentBuildInfo
  } catch {
    return developmentBuildInfo
  }
}

export function formatBuiltAt(builtAt: string, dateLocale: string) {
  const date = new Date(builtAt)
  if (Number.isNaN(date.getTime())) return builtAt
  return new Intl.DateTimeFormat(dateLocale, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

export function copyrightYear(buildInfo: BuildInfo) {
  const date = new Date(buildInfo.builtAt)
  return Number.isNaN(date.getTime())
    ? new Date().getFullYear()
    : date.getFullYear()
}
