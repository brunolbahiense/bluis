import { useCallback, type PointerEvent } from 'react'
import useReducedMotion from './useReducedMotion'

// Cria um ripple (classe global .ripple) no ponto do clique.
// O elemento precisa de position: relative e overflow: hidden.
export default function useRipple() {
  const isReducedMotion = useReducedMotion()

  return useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (isReducedMotion) return
      const target = e.currentTarget
      const bounds = target.getBoundingClientRect()
      const ripple = document.createElement('span')
      ripple.className = 'ripple'
      ripple.style.left = `${e.clientX - bounds.left}px`
      ripple.style.top = `${e.clientY - bounds.top}px`
      target.appendChild(ripple)
      ripple.addEventListener('animationend', () => ripple.remove(), {
        once: true
      })
    },
    [isReducedMotion]
  )
}
