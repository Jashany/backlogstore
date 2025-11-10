"use client"

import { useEffect, useState } from "react"

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false)

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener("change", onChange)
    // Defer the initial set to avoid synchronous setState inside the effect
    Promise.resolve().then(() => setValue(result.matches))

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
}
