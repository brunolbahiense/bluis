import { ImageResponse } from 'next/og'
import { isLocale, locales } from 'lib/locale'
import { getTranslations } from 'locales'

export const alt = 'Bruno Bahiense — Senior Software Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// ImageResponse não lê CSS custom properties: as cores repetem os tokens de styles/tokens.css.
const colors = {
  cream: '#fefaec',
  ink: '#24242c',
  accent: '#e15638',
  accentText: '#b8432a'
}

export default async function OpenGraphImage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { meta, hero, brand } = getTranslations(
    isLocale(locale) ? locale : 'pt'
  )
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background: colors.cream,
        color: colors.ink
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 26,
          letterSpacing: 3,
          color: colors.accentText
        }}
      >
        {hero.label.toUpperCase()}
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 66,
          lineHeight: 1.1,
          maxWidth: 1000
        }}
      >
        {meta.ogTagline}
      </div>
      <div style={{ display: 'flex', fontSize: 40 }}>
        {brand.firstName}
        <span style={{ color: colors.accent, marginLeft: 14 }}>
          {brand.lastName}
        </span>
      </div>
    </div>,
    size
  )
}
