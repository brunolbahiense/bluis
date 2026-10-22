import { useEffect, useRef, useState } from 'react'

type Options = { once?: boolean; threshold?: number }

export default function useInView<ElementType extends Element>({
  once = false,
  threshold = 0.15
}: Options = {}) {
  const ref = useRef<ElementType>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [once, threshold])

  return { ref, isInView }
}
