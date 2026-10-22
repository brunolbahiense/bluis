import CommandBar from 'components/CommandBar'
import LanguageSwitcher from 'components/LanguageSwitcher'
import type { Locale } from 'lib/locale'
import type { Translations } from 'locales'
import S from './styles.module.css'

type Props = {
  t: Translations['nav']
  brand: Translations['brand']
  locale: Locale
}

export default function Header({ t, brand, locale }: Props) {
  return (
    <header className={S.header} data-component="<Header />">
      <a href={`/${locale}`} className={S.brand}>
        {brand.firstName}{' '}
        <span className={S.brandAccent}>{brand.lastName}</span>
      </a>
      <nav className={S.nav} aria-label={t.ariaLabel}>
        <a href="#experience" className={S.link}>
          {t.experience}
        </a>
        <a href="#projects" className={S.link}>
          {t.projects}
        </a>
        <a href="#contact" className={S.link}>
          {t.contact}
        </a>
      </nav>
      <CommandBar variant="compact" label={t.searchTrigger} />
      <LanguageSwitcher
        locale={locale}
        label={t.switchLanguage}
        ariaLabel={t.switchLanguageLabel}
      />
    </header>
  )
}
