'use client'

import { useEffect, useState, type PointerEvent } from 'react'
import useInView from 'hooks/useInView'
import usePageVisible from 'hooks/usePageVisible'
import usePointerTilt from 'hooks/usePointerTilt'
import useReducedMotion from 'hooks/useReducedMotion'
import type { Translations } from 'locales'
import AutomationScene from './scenes/AutomationScene'
import DashboardScene from './scenes/DashboardScene'
import DealsScene from './scenes/DealsScene'
import ReportScene from './scenes/ReportScene'
import SupportScene from './scenes/SupportScene'
import S from './styles.module.css'

const phases = [
  'enter',
  'fill',
  'animate',
  'live',
  'click',
  'success',
  'exit'
] as const

type Phase = (typeof phases)[number]

const phaseDurationsMs: Record<Phase, number> = {
  enter: 1100,
  fill: 500,
  animate: 1600,
  live: 1100,
  click: 180,
  success: 2400,
  exit: 360
}

const scenes = [
  { id: 'dashboard', theme: 'coral', Component: DashboardScene },
  { id: 'report', theme: 'ink', Component: ReportScene },
  { id: 'automation', theme: 'mint', Component: AutomationScene },
  { id: 'support', theme: 'amber', Component: SupportScene },
  { id: 'deals', theme: 'coral', Component: DealsScene }
] as const

type Props = {
  t: Translations['liveBuild']
  numberLocale: string
  currency: string
}

type PieceTip = { name: string; x: number; y: number }

const tipWidth = 130

export default function LiveBuild({ t, numberLocale, currency }: Props) {
  const isReducedMotion = useReducedMotion()
  const isPageVisible = usePageVisible()
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const tilt = usePointerTilt({ maxTiltX: 10, maxTiltY: 14 })
  const [sceneIndex, setSceneIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('enter')
  const [tip, setTip] = useState<PieceTip | null>(null)

  const isPlaying = isInView && isPageVisible && !isReducedMotion
  const currentPhase: Phase = isReducedMotion ? 'success' : phase
  const scene = scenes[sceneIndex]
  const hasReached = (target: Phase) =>
    phases.indexOf(currentPhase) >= phases.indexOf(target)

  useEffect(() => {
    if (!isPlaying) return
    const timer = window.setTimeout(() => {
      const nextPhase = phases[phases.indexOf(phase) + 1]
      if (nextPhase) {
        setPhase(nextPhase)
        return
      }
      setSceneIndex((index) => (index + 1) % scenes.length)
      setPhase('enter')
    }, phaseDurationsMs[phase])
    return () => window.clearTimeout(timer)
  }, [isPlaying, phase])

  function showNextScene() {
    setSceneIndex((index) => (index + 1) % scenes.length)
    setPhase('enter')
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    tilt.onPointerMove(e)
    const piece =
      e.target instanceof HTMLElement
        ? e.target.closest<HTMLElement>('[data-piece-name]')
        : null
    if (!piece) {
      setTip(null)
      return
    }
    const bounds = e.currentTarget.getBoundingClientRect()
    setTip({
      name: piece.dataset.pieceName ?? '',
      x: Math.min(e.clientX - bounds.left + 12, bounds.width - tipWidth),
      y: e.clientY - bounds.top + 14
    })
  }

  function onPointerLeave(e: PointerEvent<HTMLDivElement>) {
    tilt.onPointerLeave(e)
    setTip(null)
  }

  const { Component } = scene

  return (
    <div ref={ref} className={S.wrap} data-component="<LiveBuild /> · client">
      <p className="visually-hidden">{t.description}</p>
      <div
        aria-hidden="true"
        className={S.panel}
        data-live-build=""
        data-theme={scene.theme}
        data-static={isReducedMotion}
        data-filled={hasReached('fill')}
        data-animated={hasReached('animate')}
        data-live={hasReached('live')}
        data-clicked={currentPhase === 'click'}
        data-success={hasReached('success')}
        data-exiting={currentPhase === 'exit'}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onClick={showNextScene}
      >
        <div className={S.dots} />
        <div className={S.head}>
          <span className={S.statusDot} />
          <span>{hasReached('live') ? t.live : t.building}</span>
          <span className={S.kind}>{t[scene.id].kind}</span>
        </div>
        <div key={sceneIndex} className={S.stage}>
          <Component
            t={t}
            isAnimated={hasReached('animate')}
            numberLocale={numberLocale}
            currency={currency}
          />
        </div>
        <span className={S.ghost}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path className={S.ghostPath} d="M4 3l15 8-7 2-3 7z" />
          </svg>
        </span>
        {tip && (
          <span className={S.tip} style={{ left: tip.x, top: tip.y }}>
            {tip.name}
          </span>
        )}
      </div>
    </div>
  )
}
