import type { CSSProperties } from 'react'
import S from '../styles.module.css'
import { AppHeader, Piece, SceneButton, type SceneProps } from './shared'

export default function ReportScene({ t }: SceneProps) {
  const { report } = t
  return (
    <>
      <AppHeader title={report.title} />
      <Piece
        name="<ReportTable />"
        order={1}
        depth={30}
        className={`${S.card} ${S.table}`}
      >
        <div className={`${S.row} ${S.rowHead}`}>
          {report.columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        {report.rows.map((row, index) => (
          <div
            key={row.channel}
            className={S.row}
            style={{ '--row-order': index } as CSSProperties}
          >
            <span>{row.channel}</span>
            <span>
              <span className={S.tag}>{row.status}</span>
            </span>
            <b>{row.total}</b>
          </div>
        ))}
      </Piece>
      <SceneButton label={report.cta} success={report.success} order={2} />
    </>
  )
}
