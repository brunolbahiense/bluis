import SectionTitle from 'components/SectionTitle'
import Stack from 'components/Stack'
import type { Translations } from 'locales'
import S from './styles.module.css'

export default function Experience({ t }: { t: Translations['experience'] }) {
  return (
    <section
      id="experience"
      className={S.experience}
      data-component="<Experience />"
    >
      <SectionTitle label={t.label} title={t.title} />
      <ol className={S.timeline}>
        {t.items.map((item) => (
          <li key={item.period} className={S.item}>
            <span className={S.period}>{item.period}</span>
            <div>
              <h3 className={S.role}>{item.role}</h3>
              <p className={S.description}>{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <Stack title={t.stackTitle} groups={t.stackGroups} />
    </section>
  )
}
