import CountUp from 'components/CountUp'
import ProgressBar from 'components/ProgressBar'
import TiltCard from 'components/TiltCard'
import type { Translations } from 'locales'
import S from './styles.module.css'

type Props = { t: Translations['metrics']; numberLocale: string }

export default function Metrics({ t, numberLocale }: Props) {
  return (
    <section
      className={S.metrics}
      aria-label={t.label}
      data-component="<Metrics />"
    >
      {t.items.map((item) => (
        <TiltCard
          key={item.description}
          className={S.card}
          component="<MetricCard />"
        >
          <span className={S.state} data-tone={item.tone}>
            {item.state}
          </span>
          <b className={S.value}>
            {item.countTo === null ? (
              item.value
            ) : (
              <CountUp
                to={item.countTo}
                suffix={item.suffix}
                locale={numberLocale}
              />
            )}
          </b>
          <p className={S.description}>{item.description}</p>
          <ProgressBar value={item.progress} />
          <small className={S.note}>{item.note}</small>
        </TiltCard>
      ))}
    </section>
  )
}
