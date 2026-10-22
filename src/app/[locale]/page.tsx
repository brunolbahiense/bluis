import { notFound } from 'next/navigation'
import Contact from 'components/Contact'
import Experience from 'components/Experience'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Hero from 'components/Hero'
import Inspector from 'components/Inspector'
import LiveBuild from 'components/LiveBuild'
import Metrics from 'components/Metrics'
import Projects from 'components/Projects'
import Spotlight from 'components/Spotlight'
import { InspectorProvider } from 'contexts/InspectorContext'
import { SpotlightProvider } from 'contexts/SpotlightContext'
import { copyrightYear } from 'lib/buildInfo'
import { isLocale } from 'lib/locale'
import { readBuildInfo } from 'lib/readBuildInfo'
import { getTranslations } from 'locales'
import S from './page.module.css'

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const translations = getTranslations(locale)
  const buildInfo = readBuildInfo()
  const githubUrl =
    translations.contact.socials.find((social) => social.id === 'github')
      ?.href ?? ''

  return (
    <InspectorProvider>
      <SpotlightProvider>
        <Header
          t={translations.nav}
          brand={translations.brand}
          locale={locale}
        />
        <main className={S.main}>
          <Hero
            t={translations.hero}
            githubUrl={githubUrl}
            visual={
              <LiveBuild
                t={translations.liveBuild}
                numberLocale={translations.dateLocale}
                currency={translations.currency}
              />
            }
          />
          <Metrics
            t={translations.metrics}
            numberLocale={translations.dateLocale}
          />
          <Experience t={translations.experience} />
          <Projects t={translations.projects} />
          <Contact
            t={translations.contact}
            copiedMessage={translations.spotlight.toasts.emailCopied}
          />
        </main>
        <Footer
          t={translations.footer}
          brand={translations.brand}
          toasts={translations.spotlight.toasts}
          version={buildInfo.version}
          year={copyrightYear(buildInfo)}
        />
        <Spotlight
          t={translations.spotlight}
          projects={translations.projects}
          experience={translations.experience}
          contact={translations.contact}
          locale={locale}
        />
        <Inspector
          t={translations.inspector}
          buildInfo={buildInfo}
          dateLocale={translations.dateLocale}
        />
      </SpotlightProvider>
    </InspectorProvider>
  )
}
