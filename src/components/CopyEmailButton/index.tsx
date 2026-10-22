'use client'

import { useSpotlight } from 'contexts/SpotlightContext'
import useRipple from 'hooks/useRipple'
import { copyText } from 'lib/clipboard'
import S from './styles.module.css'

type Props = { email: string; label: string; copiedMessage: string }

export default function CopyEmailButton({
  email,
  label,
  copiedMessage
}: Props) {
  const { notify } = useSpotlight()
  const createRipple = useRipple()

  return (
    <button
      type="button"
      className={S.button}
      onPointerDown={createRipple}
      onClick={async () => {
        await copyText(email)
        notify(copiedMessage)
      }}
      data-component="<CopyEmailButton />"
    >
      {label}
    </button>
  )
}
