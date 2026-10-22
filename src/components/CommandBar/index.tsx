'use client'

import { useSpotlight } from 'contexts/SpotlightContext'
import { useModifierLabel } from 'hooks/useHotkey'
import useMagnetic from 'hooks/useMagnetic'
import { SearchIcon } from 'components/Spotlight/icons'
import S from './styles.module.css'

type Props = { variant: 'hero' | 'compact'; label: string; hints?: string[] }

export default function CommandBar({ variant, label, hints = [] }: Props) {
  const { open } = useSpotlight()
  const modifierLabel = useModifierLabel()
  const magnetic = useMagnetic(variant === 'hero' ? 0.06 : 0.12)

  return (
    <div className={S[variant]}>
      <button
        type="button"
        className={S.bar}
        aria-haspopup="dialog"
        onClick={() => open()}
        onPointerMove={magnetic.onPointerMove}
        onPointerLeave={magnetic.onPointerLeave}
        data-component={
          variant === 'hero' ? '<CommandBar />' : '<CommandBar compact />'
        }
      >
        <SearchIcon />
        <span className={S.label}>{label}</span>
        <kbd className={S.kbd}>{modifierLabel}K</kbd>
      </button>
      {hints.length > 0 && (
        <p className={S.hints}>
          {hints.map((hint) => (
            <button
              key={hint}
              type="button"
              className={S.hint}
              onClick={() => open(hint)}
            >
              “{hint}”
            </button>
          ))}
        </p>
      )}
    </div>
  )
}
