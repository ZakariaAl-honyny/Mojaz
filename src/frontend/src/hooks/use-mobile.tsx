'use client'

import * as React from 'react'

const MOBILE_BREAKPOINT = 768

function getInitialMobileState(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
}

export function useIsMobile() {
  const [isMobile] = React.useState<boolean>(getInitialMobileState)

  return isMobile
}