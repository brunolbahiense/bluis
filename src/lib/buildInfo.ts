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
