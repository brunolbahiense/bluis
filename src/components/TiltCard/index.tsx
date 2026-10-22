'use client'

import type { ReactNode } from 'react'
import usePointerTilt from 'hooks/usePointerTilt'
import S from './styles.module.css'

type Props = {
  component: string
  className?: string
  as?: 'div' | 'article' | 'li'
  children: ReactNode
}

export default function TiltCard({
  component,
  className = '',
  as: Element = 'div',
  children
}: Props) {
  const tilt = usePointerTilt()
  return (
    <Element
      className={`${S.card} ${className}`}
      data-component={component}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      {children}
    </Element>
  )
}
