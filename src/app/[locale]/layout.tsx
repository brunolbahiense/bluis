import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { htmlLang, isLocale, locales } from 'lib/locale'
import { getTranslations } from 'locales'
import { fontVariables } from 'styles/fonts'
import '../../styles/tokens.css'
import '../../styles/global.css'

const siteUrl = 'https://bluis.vercel.app'

type LayoutParams = { params: Promise<{ locale: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params
}: LayoutParams): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { meta } = getTranslations(locale)
  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { 'pt-BR': '/pt', en: '/en' }
    },
    openGraph: {
      type: 'website',
      url: `/${locale}`,
      title: meta.title,
      description: meta.description,
      locale: htmlLang[locale].replace('-', '_')
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description
    }
  }
}

export default async function LocaleLayout({
  children,
  params
}: LayoutParams & { children: ReactNode }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return (
    <html lang={htmlLang[locale]} className={fontVariables}>
      <body>{children}</body>
    </html>
  )
}
