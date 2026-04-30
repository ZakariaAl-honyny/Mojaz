'use client'

import * as React from 'react'

const MOBILE_BREAKPOINT = 768

function getInitialMobileState(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(getInitialMobileState())

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    mql.addEventListener('change', onChange)
    
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}