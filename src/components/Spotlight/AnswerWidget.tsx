import type { AnswerWidget as AnswerWidgetData, Translations } from 'locales'
import S from './styles.module.css'

type Props = { widget: AnswerWidgetData; projects: Translations['projects'] }

export default function AnswerWidget({ widget, projects }: Props) {
  switch (widget.type) {
    case 'chips':
      return (
        <ul className={S.chips} data-component="<Chips />">
          {widget.items.map((item) => (
            <li key={item} className={S.chip}>
              {item}
            </li>
          ))}
        </ul>
      )
    case 'rows':
      return (
        <div className={S.rows} data-component="<StatusRows />">
          {widget.items.map((item) => (
            <div key={item.label} className={S.row}>
              <span>{item.label}</span>
              <span className={S.rowStatus}>{item.status}</span>
            </div>
          ))}
        </div>
      )
    case 'flow':
      return (
        <ol className={S.flow} data-component="<DeliveryFlow />">
          {widget.steps.map((step) => (
            <li key={step.label} className={S.step}>
              <small className={S.stepLabel}>{step.label}</small>
              {step.text}
            </li>
          ))}
        </ol>
      )
    case 'projects':
      return (
        <div className={S.rows} data-component="<ProjectRows />">
          {projects.items.map((project) => (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className={S.row}
            >
              <span>
                <b>{project.name}</b> · {project.description}
              </span>
              <span className={S.rowStatus}>{projects.open} ↗</span>
            </a>
          ))}
        </div>
      )
  }
}
