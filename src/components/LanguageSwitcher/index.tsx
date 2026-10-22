import { otherLocale, type Locale } from 'lib/locale'
import S from './styles.module.css'

type Props = { locale: Locale; label: string; ariaLabel: string }

export default function LanguageSwitcher({ locale, label, ariaLabel }: Props) {
  const target = otherLocale(locale)
  return (
    <a
      href={`/${target}`}
      hrefLang={target}
      className={S.switcher}
      aria-label={ariaLabel}
    >
      {label}
    </a>
  )
}
