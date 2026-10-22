import { otherLocale, type Locale } from 'lib/locale'
import S from './styles.module.css'

type Props = { locale: Locale; label: string; fullLabel: string }

export default function LanguageSwitcher({ locale, label, fullLabel }: Props) {
  const target = otherLocale(locale)
  return (
    <a href={`/${target}`} hrefLang={target} className={S.switcher}>
      {label}
      <span className="visually-hidden"> · {fullLabel}</span>
    </a>
  )
}
