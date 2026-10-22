import type { ReactNode } from 'react'
import CommandBar from 'components/CommandBar'
import MagneticButton from 'components/MagneticButton'
import type { Translations } from 'locales'
import S from './styles.module.css'

type Props = { t: Translations['hero']; githubUrl: string; visual: ReactNode }

export default function Hero({ t, githubUrl, visual }: Props) {
  return (
    <section className={S.hero} data-component="<Hero />">
      <div className={S.text}>
        <p className={S.label}>{t.label}</p>
        <h1 className={S.title}>
          {t.titleStart}
          <em className={S.emphasis}>{t.titleEmphasis}</em>
          {t.titleEnd}
        </h1>
        <p className={S.bio}>{t.bio}</p>
        <CommandBar
          variant="hero"
          label={t.commandPlaceholder}
          hints={t.hints}
        />
        <div className={S.actions}>
          <MagneticButton href="#contact" variant="primary">
            {t.primaryCta}
          </MagneticButton>
          <MagneticButton href={githubUrl} variant="ghost" isExternal>
            {t.secondaryCta}
          </MagneticButton>
        </div>
      </div>
      <div className={S.visual}>{visual}</div>
    </section>
  )
}
