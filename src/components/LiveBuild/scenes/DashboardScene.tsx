import type { CSSProperties } from 'react'
import CountUp from 'components/CountUp'
import S from '../styles.module.css'
import { AppHeader, Piece, SceneButton, type SceneProps } from './shared'

const barHeights = [38, 52, 44, 61, 58, 72, 92]
const monthlyRevenue = 184320

export default function DashboardScene({
  t,
  isAnimated,
  numberLocale,
  currency
}: SceneProps) {
  const { dashboard } = t
  return (
    <>
      <AppHeader title={dashboard.title} />
      <Piece name="<KpiCard />" order={1} depth={30} className={S.card}>
        <span className={S.cardLabel}>{dashboard.kpiLabel}</span>
        <b className={S.kpi}>
          <CountUp
            to={monthlyRevenue}
            locale={numberLocale}
            formatOptions={{
              style: 'currency',
              currency,
              maximumFractionDigits: 0
            }}
            play={isAnimated}
            idle="zero"
          />
        </b>
        <span className={S.chip}>{dashboard.delta}</span>
        <div className={S.chart}>
          {barHeights.map((height, index) => (
            <i
              key={index}
              className={S.bar}
              style={
                {
                  '--bar-height': `${height}%`,
                  '--bar-order': index
                } as CSSProperties
              }
            />
          ))}
        </div>
      </Piece>
      <SceneButton
        label={dashboard.cta}
        success={dashboard.success}
        order={2}
      />
    </>
  )
}
