'use client'

import { useEffect, useState, FC } from 'react'

interface Props {
  YourComponent: FC
}

export default function BrowserCheck({ YourComponent }: Props) {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  if (!isBrowser) {
    return null
  }

  return <YourComponent />
} 