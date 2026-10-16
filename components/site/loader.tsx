'use client'

import { useEffect, useState } from 'react'

export default function Loader() {
  const [gone, setGone] = useState(false)

  useEffect(() => {
    // Only mark the intro as "seen" once it has fully played, so a quick
    // refresh while it is still running (or a dev-server reload) shows it again.
    const t = setTimeout(() => {
      try {
        window.sessionStorage.setItem('intro-seen', '1')
      } catch {
        /* storage can be blocked; ignore */
      }
      setGone(true)
    }, 3100)
    return () => clearTimeout(t)
  }, [])

  if (gone) return null

  return (
    <div className="loader" aria-hidden="true">
      <svg className="loader-svg" viewBox="0 0 140 120">
        <path className="loader-path" d="M60 6 L112 112 L86 112 L60 58 L34 112 L8 112 Z" strokeWidth="2" strokeLinejoin="round" />
        <path className="loader-bar" d="M50 88 L74 88 L70 100 L46 100 Z" />
        <circle className="loader-bar" cx="128" cy="106" r="8" />
      </svg>
    </div>
  )
}
