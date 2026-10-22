import ProjectCard from 'components/ProjectCard'
import SectionTitle from 'components/SectionTitle'
import type { Translations } from 'locales'
import S from './styles.module.css'

export default function Projects({ t }: { t: Translations['projects'] }) {
  return (
    <section id="projects" className={S.projects} data-component="<Projects />">
      <SectionTitle label={t.label} title={t.title} />
      <div className={S.grid}>
        {t.items.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            openLabel={t.open}
          />
        ))}
      </div>
    </section>
  )
}
