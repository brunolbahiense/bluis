import { notFound } from 'next/navigation'
import { isLocale } from 'lib/locale'
import { getTranslations } from 'locales'
import S from './page.module.css'

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const { hero } = getTranslations(locale)
  return (
    <main className={S.main}>
      <h1>
        {hero.titleStart}
        {hero.titleEmphasis}
        {hero.titleEnd}
      </h1>
    </main>
  )
}
