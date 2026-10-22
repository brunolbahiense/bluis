import type { Locale } from 'lib/locale'
import en from './en'
import pt from './pt'
import type { Translations } from './types'

export type {
  AnswerWidget,
  FrequentQuestion,
  SectionId,
  SocialId,
  Translations
} from './types'

export const translations: Record<Locale, Translations> = { pt, en }

export function getTranslations(locale: Locale): Translations {
  return translations[locale]
}
