'use client'

import { useLayoutEffect, useState, ReactNode } from 'react'

export default function DynamicContent({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // useLayoutEffect runs synchronously before browser paint
  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  // Return null on first render, before hydration
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return children
} 