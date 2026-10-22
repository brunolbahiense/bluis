'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react'
import Toast from 'components/Toast'

type SpotlightContextValue = {
  isOpen: boolean
  sessionId: number
  initialQuery: string
  open: (initialQuery?: string) => void
  close: () => void
  notify: (message: string) => void
}

const SpotlightContext = createContext<SpotlightContextValue | null>(null)

const toastDurationMs = 1800

export function SpotlightProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState({ id: 0, initialQuery: '' })
  const [toast, setToast] = useState({ message: '', isVisible: false })
  const toastTimer = useRef<number | undefined>(undefined)

  const open = useCallback((initialQuery = '') => {
    setSession((current) => ({ id: current.id + 1, initialQuery }))
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  const notify = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ message, isVisible: true })
    toastTimer.current = window.setTimeout(
      () => setToast((current) => ({ ...current, isVisible: false })),
      toastDurationMs
    )
  }, [])

  const value = useMemo(
    () => ({
      isOpen,
      sessionId: session.id,
      initialQuery: session.initialQuery,
      open,
      close,
      notify
    }),
    [isOpen, session, open, close, notify]
  )

  return (
    <SpotlightContext.Provider value={value}>
      {children}
      <Toast message={toast.message} isVisible={toast.isVisible} />
    </SpotlightContext.Provider>
  )
}

export function useSpotlight() {
  const value = useContext(SpotlightContext)
  if (!value)
    throw new Error('useSpotlight precisa estar dentro de <SpotlightProvider>')
  return value
}
