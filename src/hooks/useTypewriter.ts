import { useEffect, useState } from 'react'

// Revela o texto aos poucos. Para recomeçar com outro texto, remonte o componente (key).
export default function useTypewriter(
  text: string,
  isEnabled: boolean,
  charactersPerTick = 2,
  tickMs = 14
) {
  const [typedLength, setTypedLength] = useState(0)

  useEffect(() => {
    if (!isEnabled || typedLength >= text.length) return
    const timer = window.setTimeout(
      () =>
        setTypedLength((length) =>
          Math.min(text.length, length + charactersPerTick)
        ),
      tickMs
    )
    return () => window.clearTimeout(timer)
  }, [isEnabled, typedLength, text, charactersPerTick, tickMs])

  return isEnabled ? text.slice(0, typedLength) : text
}
