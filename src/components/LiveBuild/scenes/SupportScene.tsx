import type { CSSProperties } from 'react'
import S from '../styles.module.css'
import { AppHeader, Piece, SceneButton, type SceneProps } from './shared'

export default function SupportScene({ t }: SceneProps) {
  const { support } = t
  return (
    <>
      <AppHeader title={support.title} />
      <Piece
        name="<ChatThread />"
        order={1}
        depth={30}
        className={`${S.card} ${S.chat}`}
      >
        <div className={`${S.message} ${S.customer}`}>{support.customer}</div>
        <div
          className={`${S.message} ${S.assistant}`}
          style={{ '--message-delay': '0.4s' } as CSSProperties}
        >
          <small className={S.assistantLabel}>{support.assistant}</small>
          <span className={S.assistantBody}>
            <span className={S.typing}>
              <i />
              <i />
              <i />
            </span>
            <span className={S.reply}>{support.reply}</span>
          </span>
        </div>
      </Piece>
      <SceneButton label={support.cta} success={support.success} order={2} />
    </>
  )
}
