import { useCallback, type PointerEvent } from 'react'
import useReducedMotion from './useReducedMotion'

// Escreve --magnet-x/--magnet-y: o elemento é puxado levemente na direção do cursor.
export default function useMagnetic(strength = 0.25) {
  const isReducedMotion = useReducedMotion()

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (isReducedMotion) return
      const element = e.currentTarget
      const bounds = element.getBoundingClientRect()
      element.style.setProperty(
        '--magnet-x',
        `${(e.clientX - bounds.left - bounds.width / 2) * strength}px`
      )
      element.style.setProperty(
        '--magnet-y',
        `${(e.clientY - bounds.top - bounds.height / 2) * strength}px`
      )
    },
    [isReducedMotion, strength]
  )

  const onPointerLeave = useCallback((e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--magnet-x', '0px')
    e.currentTarget.style.setProperty('--magnet-y', '0px')
  }, [])

  return { onPointerMove, onPointerLeave }
}
