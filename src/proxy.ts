import { NextResponse, type NextRequest } from 'next/server'
import { chooseLocale, localeCookie, localeFromPath } from 'lib/locale'

const oneYearInSeconds = 60 * 60 * 24 * 365

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathLocale = localeFromPath(pathname)

  if (pathLocale) {
    const response = NextResponse.next()
    if (request.cookies.get(localeCookie)?.value !== pathLocale) {
      response.cookies.set(localeCookie, pathLocale, {
        path: '/',
        maxAge: oneYearInSeconds,
        sameSite: 'lax'
      })
    }
    return response
  }

  const locale = chooseLocale({
    cookie: request.cookies.get(localeCookie)?.value,
    acceptLanguage: request.headers.get('accept-language')
  })
  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Ignora arquivos internos do Next e qualquer caminho com extensão (imagens, ícone, etc.)
  matcher: ['/((?!_next|.*\\..*).*)']
}
