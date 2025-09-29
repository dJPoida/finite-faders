"use client"

import { useEffect, useState } from "react"

interface ClientOnlyStoreProps {
  children: React.ReactNode
}

export default function ClientOnlyStore({ children }: ClientOnlyStoreProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}