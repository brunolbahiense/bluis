import type { CSSProperties } from 'react'
import CountUp from 'components/CountUp'
import S from '../styles.module.css'
import { AppHeader, Piece, SceneButton, type SceneProps } from './shared'

const payInFullAmount = 1240
const stepCount = 3

export default function DealsScene({
  t,
  isAnimated,
  numberLocale,
  currency
}: SceneProps) {
  const { deals } = t
  return (
    <>
      <AppHeader title={deals.title} />
      <Piece
        name="<OfferCard />"
        order={1}
        depth={30}
        className={`${S.card} ${S.metricCard}`}
      >
        <span className={S.cardLabel}>{deals.kpiLabel}</span>
        <b className={S.kpi}>
          <CountUp
            to={payInFullAmount}
            locale={numberLocale}
            formatOptions={{
              style: 'currency',
              currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }}
            play={isAnimated}
            idle="zero"
          />
        </b>
        <span className={S.chip}>{deals.discount}</span>
        <div className={S.steps}>
          {Array.from({ length: stepCount }, (_, index) => (
            <i
              key={index}
              className={S.step}
              style={{ '--step-order': index } as CSSProperties}
            />
          ))}
        </div>
      </Piece>
      <SceneButton label={deals.cta} success={deals.success} order={2} />
    </>
  )
}
