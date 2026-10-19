'use client'

import { useEffect, useRef } from 'react'

// Lights up the background grid lines: a beam that sweeps across, little streaks
// that run along single lines, and a glow that follows the mouse.
const hLines = [2, 5, 8, 10]
const vLines = [3, 7, 12, 17, 22]

export default function GridGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = ref.current?.parentElement
    if (!host) return
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = host.getBoundingClientRect()
      host.style.setProperty('--gx', `${e.clientX - r.left}px`)
      host.style.setProperty('--gy', `${e.clientY - r.top}px`)
    }
    host.addEventListener('pointermove', move)
    // stop all the line animations while the hero is out of view
    const io = new IntersectionObserver(([e]) => {
      ref.current?.classList.toggle('glow-paused', !e.isIntersecting)
    })
    io.observe(host)
    return () => {
      host.removeEventListener('pointermove', move)
      io.disconnect()
    }
  }, [])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="grid-glow grid-sweep" />
      <div className="grid-glow grid-spot" />
      {hLines.map((k, i) => (
        <span
          key={`h${k}`}
          className="streak-h"
          style={{ top: k * 72, animationDuration: `${7 + i * 2.3}s`, animationDelay: `${-i * 2.7}s` }}
        />
      ))}
      {vLines.map((k, i) => (
        <span
          key={`v${k}`}
          className="streak-v"
          style={{ left: k * 72, animationDuration: `${8 + i * 1.9}s`, animationDelay: `${-i * 2.1}s` }}
        />
      ))}
    </div>
  )
}
