'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'

type InspectorContextValue = {
  isInspecting: boolean
  toggle: () => void
  stop: () => void
}

const InspectorContext = createContext<InspectorContextValue | null>(null)

export function InspectorProvider({ children }: { children: ReactNode }) {
  const [isInspecting, setIsInspecting] = useState(false)

  useEffect(() => {
    document.documentElement.toggleAttribute('data-inspecting', isInspecting)
  }, [isInspecting])

  const toggle = useCallback(() => setIsInspecting((current) => !current), [])
  const stop = useCallback(() => setIsInspecting(false), [])
  const value = useMemo(
    () => ({ isInspecting, toggle, stop }),
    [isInspecting, toggle, stop]
  )

  return (
    <InspectorContext.Provider value={value}>
      {children}
    </InspectorContext.Provider>
  )
}

export function useInspector() {
  const value = useContext(InspectorContext)
  if (!value)
    throw new Error('useInspector precisa estar dentro de <InspectorProvider>')
  return value
}
