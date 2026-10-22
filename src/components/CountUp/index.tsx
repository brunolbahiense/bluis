'use client'

import { useEffect, useState } from 'react'
import useInView from 'hooks/useInView'
import useReducedMotion from 'hooks/useReducedMotion'

type Props = {
  to: number
  locale: string
  suffix?: string
  // Se usar minimumFractionDigits, passe também maximumFractionDigits (o padrão é 0).
  formatOptions?: Intl.NumberFormatOptions
  durationMs?: number
  // Controle externo (LiveBuild). Sem ele, conta quando entra na tela.
  play?: boolean
  // O que mostrar antes de tocar: valor final (bom para HTML do servidor) ou zero.
  idle?: 'final' | 'zero'
}

export default function CountUp({
  to,
  locale,
  suffix = '',
  formatOptions,
  durationMs = 1100,
  play,
  idle = 'final'
}: Props) {
  const isReducedMotion = useReducedMotion()
  const { ref, isInView } = useInView<HTMLSpanElement>({ once: true })
  const shouldPlay = play ?? isInView
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!shouldPlay || isReducedMotion) return
    let frame = 0
    const startedAt = performance.now()
    const tick = (now: number) => {
      const nextProgress = Math.min(1, (now - startedAt) / durationMs)
      setProgress(nextProgress)
      if (nextProgress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [shouldPlay, isReducedMotion, durationMs])

  let value = to
  let isComplete = true
  if (!isReducedMotion && !shouldPlay) {
    value = idle === 'final' ? to : 0
    isComplete = idle === 'final'
  } else if (!isReducedMotion) {
    value = to * (1 - Math.pow(1 - progress, 3))
    isComplete = progress === 1
  }

  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    ...formatOptions
  })

  return (
    <span ref={ref}>
      {formatter.format(value)}
      {isComplete ? suffix : ''}
    </span>
  )
}
