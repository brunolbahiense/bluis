'use client'

import { useInspector } from 'contexts/InspectorContext'
import { useSpotlight } from 'contexts/SpotlightContext'
import S from './styles.module.css'

type Props = { label: string; onMessage: string; offMessage: string }

export default function InspectToggle({ label, onMessage, offMessage }: Props) {
  const { isInspecting, toggle } = useInspector()
  const { notify } = useSpotlight()

  return (
    <button
      type="button"
      className={S.toggle}
      aria-pressed={isInspecting}
      onClick={() => {
        notify(isInspecting ? offMessage : onMessage)
        toggle()
      }}
    >
      {label}
    </button>
  )
}
