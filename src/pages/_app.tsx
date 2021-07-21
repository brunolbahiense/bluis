import { AppProps } from 'next/app'
import Head from 'next/head'

import GlobalStyles from 'styles/global'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Bluis</title>
        <link rel="shortcut icon" href="/img/square.png" />
        <link rel="apple-touch-icon" href="/img/logob.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#06092B" />
        <meta name="Bluis" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bluis.vercel.app/" />
        <meta property="og:title" content="Bluis" />
        <meta
          property="og:description"
          content="Levando sua marca ao mundo digital!"
        />
        <meta property="og:image" content="/img/square.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://bluis.vercel.app/" />
        <meta property="twitter:title" content="Bluis" />
        <meta
          property="twitter:description"
          content="Levando sua marca ao mundo digital!"
        />
        <meta property="twitter:image" content="/img/square.png" />
      </Head>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  )
}

export default App
