import { htmlLang, locales } from 'lib/locale'
import { translations } from 'locales'
import S from './not-found.module.css'

// not-found não recebe params: mostra os dois idiomas.
export default function NotFound() {
  return (
    <main className={S.notFound}>
      {locales.map((locale) => {
        const { notFound } = translations[locale]
        return (
          <section key={locale} lang={htmlLang[locale]} className={S.block}>
            <h1 className={S.title}>{notFound.title}</h1>
            <p className={S.body}>{notFound.body}</p>
            <a href={`/${locale}`} className={S.link}>
              {notFound.back} →
            </a>
          </section>
        )
      })}
    </main>
  )
}
