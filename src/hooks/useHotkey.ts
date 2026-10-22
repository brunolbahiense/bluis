import { useEffect, useRef, useSyncExternalStore } from 'react'

// Atalho com ⌘ (Mac) ou Ctrl (demais sistemas) + tecla.
export function useHotkey(key: string, onPress: () => void) {
  const onPressRef = useRef(onPress)

  useEffect(() => {
    onPressRef.current = onPress
  })

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key) {
        e.preventDefault()
        onPressRef.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [key])
}

const noSubscription = () => () => {}

export function useModifierLabel() {
  return useSyncExternalStore(
    noSubscription,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl '),
    () => '⌘'
  )
}
