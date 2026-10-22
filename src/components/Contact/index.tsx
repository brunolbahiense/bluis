import CopyEmailButton from 'components/CopyEmailButton'
import MagneticButton from 'components/MagneticButton'
import type { Translations } from 'locales'
import S from './styles.module.css'

type Props = { t: Translations['contact']; copiedMessage: string }

export default function Contact({ t, copiedMessage }: Props) {
  return (
    <section id="contact" className={S.contact} data-component="<Contact />">
      <p className={S.label}>{t.label}</p>
      <h2 className={S.title}>
        {t.titleStart}
        <em className={S.emphasis}>{t.titleEmphasis}</em>
        {t.titleEnd}
      </h2>
      <div className={S.actions}>
        <MagneticButton href={`mailto:${t.email}`} variant="light">
          {t.email}
        </MagneticButton>
        <CopyEmailButton
          email={t.email}
          label={t.copyEmail}
          copiedMessage={copiedMessage}
        />
      </div>
      <ul className={S.socials}>
        {t.socials.map((social) => (
          <li key={social.id}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={S.social}
            >
              {social.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
