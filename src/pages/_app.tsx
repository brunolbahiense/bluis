import { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'styled-components'

import GlobalStyles from 'styles/global'
import theme from 'styles/theme'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Bluis</title>
        <link rel="shortcut icon" href="/img/logo.svg" />
        <link rel="apple-touch-icon" href="/img/logo.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fefaec" />
        <meta name="Bluis" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bluis.vercel.app/" />
        <meta property="og:title" content="Bluis" />
        <meta
          property="og:description"
          content="Levando sua marca ao mundo digital!"
        />
        <meta property="og:image" content="/img/logo.svg" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://bluis.vercel.app/" />
        <meta property="twitter:title" content="Bluis" />
        <meta
          property="twitter:description"
          content="Levando sua marca ao mundo digital!"
        />
        <meta property="twitter:image" content="/img/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default App
