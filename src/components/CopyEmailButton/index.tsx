'use client'

import { useSpotlight } from 'contexts/SpotlightContext'
import useRipple from 'hooks/useRipple'
import { copyText } from 'lib/clipboard'
import S from './styles.module.css'

type Props = {
  email: string
  label: string
  copiedMessage: string
  failedMessage: string
}

export default function CopyEmailButton({
  email,
  label,
  copiedMessage,
  failedMessage
}: Props) {
  const { notify } = useSpotlight()
  const createRipple = useRipple()

  return (
    <button
      type="button"
      className={S.button}
      onPointerDown={createRipple}
      onClick={async () => {
        const copied = await copyText(email)
        notify(copied ? copiedMessage : failedMessage)
      }}
      data-component="<CopyEmailButton />"
    >
      {label}
    </button>
  )
}
