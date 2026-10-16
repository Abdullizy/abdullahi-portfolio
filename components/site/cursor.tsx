'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Custom cursor: a small dot that sticks to the pointer plus a ring that trails it.
// The ring grows over links and buttons. Only for mouse users; touch screens skip it.
export default function Cursor() {
  const [on, setOn] = useState(false)
  const [mode, setMode] = useState<'idle' | 'link' | 'text' | 'down'>('idle')
  const [seen, setSeen] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 260, damping: 24, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 260, damping: 24, mass: 0.5 })

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    setOn(true)
    document.documentElement.classList.add('has-cursor')

    const move = (e: globalThis.PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      setSeen(true)
      const t = e.target as Element | null
      if (t?.closest('input, textarea')) setMode('text')
      else if (t?.closest('a, button, [role="button"], label, .tcard')) setMode('link')
      else setMode('idle')
    }
    const down = () => setMode((m) => (m === 'text' ? m : 'down'))
    const up = () => setMode('idle')
    const leave = () => setSeen(false)

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [x, y])

  if (!on) return null
  const hidden = !seen || mode === 'text'

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] size-9 rounded-full border-2 border-white mix-blend-difference"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: hidden ? 0 : 1,
          scale: mode === 'link' ? 1.9 : mode === 'down' ? 0.7 : 1,
          backgroundColor: mode === 'link' ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0)',
        }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] size-2 rounded-full bg-white mix-blend-difference"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: hidden ? 0 : 1, scale: mode === 'link' ? 0.4 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
