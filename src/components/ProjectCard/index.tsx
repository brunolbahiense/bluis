import Image from 'next/image'
import TiltCard from 'components/TiltCard'
import type { Translations } from 'locales'
import S from './styles.module.css'

type Props = {
  project: Translations['projects']['items'][number]
  openLabel: string
}

export default function ProjectCard({ project, openLabel }: Props) {
  return (
    <TiltCard as="article" className={S.card} component="<ProjectCard />">
      <div className={S.thumb}>
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(max-width: 48rem) 100vw, 33vw"
          className={S.image}
        />
      </div>
      <div className={S.body}>
        <h3 className={S.name}>{project.name}</h3>
        <p className={S.description}>{project.description}</p>
        <div className={S.meta}>
          <span className={S.tech}>{project.tech}</span>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className={S.link}
          >
            {openLabel} ↗
          </a>
        </div>
      </div>
    </TiltCard>
  )
}
