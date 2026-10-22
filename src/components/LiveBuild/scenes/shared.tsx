import type { CSSProperties, ReactNode } from 'react'
import type { Translations } from 'locales'
import S from '../styles.module.css'

export type SceneProps = {
  t: Translations['liveBuild']
  isAnimated: boolean
  numberLocale: string
  currency: string
}

type PieceProps = {
  name: string
  order: number
  depth: number
  className?: string
  children: ReactNode
}

export function Piece({
  name,
  order,
  depth,
  className = '',
  children
}: PieceProps) {
  const style = { '--order': order, '--depth': `${depth}px` } as CSSProperties
  return (
    <div
      className={`${S.piece} ${className}`}
      data-piece-name={name}
      style={style}
    >
      {children}
    </div>
  )
}

export function AppHeader({ title }: { title: string }) {
  return (
    <Piece name="<AppHeader />" order={0} depth={10} className={S.appHeader}>
      <span className={S.appLogo} />
      <span className={S.skeleton} />
      <span className={S.realText}>{title}</span>
    </Piece>
  )
}

export function SceneButton({
  label,
  success,
  order
}: {
  label: string
  success: string
  order: number
}) {
  return (
    <Piece
      name="<Button primary />"
      order={order}
      depth={40}
      className={S.ctaPiece}
    >
      <span className={S.cta}>
        <span className={S.ctaLabel}>{label}</span>
        <span className={S.ctaSuccess}>{success}</span>
      </span>
    </Piece>
  )
}
