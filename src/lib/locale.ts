export const locales = ['pt', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'pt'

const foreignVisitorLocale: Locale = 'en'

export const localeCookie = 'locale'

export const htmlLang: Record<Locale, string> = { pt: 'pt-BR', en: 'en' }

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === 'string' && (locales as readonly string[]).includes(value)
  )
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'pt' ? 'en' : 'pt'
}

export function localeFromPath(pathname: string): Locale | null {
  const firstSegment = pathname.split('/')[1]
  return isLocale(firstSegment) ? firstSegment : null
}

function parseAcceptLanguage(header: string) {
  return header
    .split(',')
    .map((part, position) => {
      const [tag, ...parameters] = part.trim().split(';')
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().toLowerCase().startsWith('q=')
      )
      const quality = qualityParameter
        ? Number(qualityParameter.trim().slice(2))
        : 1
      return {
        language: tag.toLowerCase().split('-')[0],
        quality: Number.isNaN(quality) ? 0 : quality,
        position
      }
    })
    .filter((entry) => entry.language && entry.quality > 0)
    .sort(
      (first, second) =>
        second.quality - first.quality || first.position - second.position
    )
}

export function chooseLocale({
  cookie,
  acceptLanguage
}: {
  cookie?: string
  acceptLanguage?: string | null
}): Locale {
  if (isLocale(cookie)) return cookie
  if (!acceptLanguage?.trim()) return defaultLocale
  const preferred = parseAcceptLanguage(acceptLanguage).find((entry) =>
    isLocale(entry.language)
  )
  return preferred ? (preferred.language as Locale) : foreignVisitorLocale
}
