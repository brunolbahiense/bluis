import { useCallback, type PointerEvent } from 'react'
import useReducedMotion from './useReducedMotion'

// Escreve --pointer-x/--pointer-y (brilho) e --tilt-x/--tilt-y (inclinação) no elemento.
export default function usePointerTilt({ maxTiltX = 5, maxTiltY = 6 } = {}) {
  const isReducedMotion = useReducedMotion()

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const element = e.currentTarget
      const bounds = element.getBoundingClientRect()
      const x = (e.clientX - bounds.left) / bounds.width
      const y = (e.clientY - bounds.top) / bounds.height
      element.style.setProperty('--pointer-x', `${x * 100}%`)
      element.style.setProperty('--pointer-y', `${y * 100}%`)
      if (isReducedMotion) return
      element.style.setProperty('--tilt-x', `${(0.5 - y) * maxTiltX}deg`)
      element.style.setProperty('--tilt-y', `${(x - 0.5) * maxTiltY}deg`)
    },
    [isReducedMotion, maxTiltX, maxTiltY]
  )

  const onPointerLeave = useCallback((e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--tilt-x', '0deg')
    e.currentTarget.style.setProperty('--tilt-y', '0deg')
  }, [])

  return { onPointerMove, onPointerLeave }
}
