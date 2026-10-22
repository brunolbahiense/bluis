'use client'

import type { ReactNode } from 'react'
import useMagnetic from 'hooks/useMagnetic'
import useRipple from 'hooks/useRipple'
import S from './styles.module.css'

type Props = {
  href: string
  variant: 'primary' | 'ghost' | 'light'
  isExternal?: boolean
  children: ReactNode
}

export default function MagneticButton({
  href,
  variant,
  isExternal = false,
  children
}: Props) {
  const magnetic = useMagnetic(0.25)
  const createRipple = useRipple()
  const externalProps = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <a
      href={href}
      className={`${S.button} ${S[variant]}`}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      onPointerDown={createRipple}
      data-component={`<Button ${variant} />`}
      {...externalProps}
    >
      {children}
    </a>
  )
}
