'use client'

import { useEffect, useState } from 'react'
import { useInspector } from 'contexts/InspectorContext'
import { formatBuiltAt, type BuildInfo } from 'lib/buildInfo'
import type { Translations } from 'locales'
import S from './styles.module.css'

const colorTokens = [
  '--color-cream',
  '--color-surface',
  '--color-ink',
  '--color-accent',
  '--color-highlight',
  '--color-line'
]

const tipWidth = 230
const tipHeight = 90

type InspectTip = {
  name: string
  size: string
  padding: string
  radius: string
  x: number
  y: number
}

type Props = {
  t: Translations['inspector']
  buildInfo: BuildInfo
  dateLocale: string
}

export default function Inspector({ t, buildInfo, dateLocale }: Props) {
  const { isInspecting, stop } = useInspector()
  const [tip, setTip] = useState<InspectTip | null>(null)

  useEffect(() => {
    if (!isInspecting) return
    const supportsSquircle = CSS.supports('corner-shape', 'squircle')
    let hovered: Element | null = null

    function onPointerMove(e: PointerEvent) {
      const target =
        e.target instanceof Element
          ? e.target.closest('[data-component]')
          : null
      if (target !== hovered) {
        hovered?.removeAttribute('data-inspect-hover')
        target?.setAttribute('data-inspect-hover', '')
        hovered = target
      }
      if (!target) {
        setTip(null)
        return
      }
      const style = getComputedStyle(target)
      const bounds = target.getBoundingClientRect()
      setTip({
        name: target.getAttribute('data-component') ?? '',
        size: `${Math.round(bounds.width)} × ${Math.round(bounds.height)}`,
        padding: [
          style.paddingTop,
          style.paddingRight,
          style.paddingBottom,
          style.paddingLeft
        ].join(' '),
        radius: `${style.borderTopLeftRadius}${supportsSquircle ? ' · squircle' : ''}`,
        x: Math.min(e.clientX + 14, window.innerWidth - tipWidth),
        y: Math.min(e.clientY + 16, window.innerHeight - tipHeight)
      })
    }

    window.addEventListener('pointermove', onPointerMove)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      hovered?.removeAttribute('data-inspect-hover')
    }
  }, [isInspecting])

  if (!isInspecting) return null

  const testsValue = t.testsValue
    .replace('{passed}', String(buildInfo.tests.passed))
    .replace('{total}', String(buildInfo.tests.total))

  return (
    <>
      <aside className={S.panel} aria-label={t.title}>
        <div className={S.head}>
          <b>{t.title}</b>
          <button type="button" className={S.close} onClick={stop}>
            {t.close}
          </button>
        </div>
        <p className={S.hint}>{t.hint}</p>

        <h3 className={S.heading}>{t.colors}</h3>
        <ul className={S.list}>
          {colorTokens.map((token) => (
            <li key={token}>
              <i className={S.swatch} style={{ background: `var(${token})` }} />
              {token}
            </li>
          ))}
        </ul>

        <h3 className={S.heading}>{t.typography}</h3>
        <ul className={S.list}>
          {t.typographyItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className={S.heading}>{t.rendering}</h3>
        <p>{t.renderingValue}</p>

        <h3 className={S.heading}>{t.build}</h3>
        <dl className={S.build}>
          <dt>{t.version}</dt>
          <dd>v{buildInfo.version}</dd>
          <dt>{t.commit}</dt>
          <dd>{buildInfo.commit}</dd>
          <dt>{t.builtAt}</dt>
          <dd>{formatBuiltAt(buildInfo.builtAt, dateLocale)}</dd>
          <dt>{t.tests}</dt>
          <dd>{testsValue}</dd>
        </dl>
      </aside>

      {tip && (
        <div
          className={S.tip}
          style={{ left: tip.x, top: tip.y, maxWidth: tipWidth }}
          aria-hidden="true"
        >
          <b>{tip.name}</b>
          <br />
          {tip.size}
          <br />
          {t.tipPadding} {tip.padding}
          <br />
          {t.tipRadius} {tip.radius}
        </div>
      )}
    </>
  )
}
