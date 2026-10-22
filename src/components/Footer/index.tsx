import InspectToggle from 'components/InspectToggle'
import type { Translations } from 'locales'
import S from './styles.module.css'

type Props = {
  t: Translations['footer']
  brand: Translations['brand']
  toasts: Translations['spotlight']['toasts']
  version: string
  year: number
}

export default function Footer({ t, brand, toasts, version, year }: Props) {
  return (
    <footer className={S.footer} data-component="<Footer />">
      <span>
        © {year} {brand.firstName} {brand.lastName}
      </span>
      <span className={S.version}>
        {t.version} {version}
      </span>
      <span className={S.inspect}>
        <InspectToggle
          label={t.inspect}
          onMessage={toasts.inspectOn}
          offMessage={toasts.inspectOff}
        />
      </span>
    </footer>
  )
}
