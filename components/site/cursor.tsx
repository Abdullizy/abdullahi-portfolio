'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Custom cursor: a small dot that sticks to the pointer plus a ring that trails it.
// The ring grows over links and buttons. Only for mouse users; touch screens skip it.
// Its colour flips over purple areas so it is always visible (no blend modes: those are slow).
const ZONES = '.contact-shape, .morph, .bg-primary, .menu-cut'

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
    const root = document.documentElement
    root.classList.add('has-cursor')
    let zone = ''

    const move = (e: globalThis.PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      setSeen(true)
      const t = e.target as Element | null
      const next = t?.closest(ZONES) ? 'accent' : 'plain'
      if (next !== zone) {
        zone = next
        // on a violet area the cursor turns lime; on a lime area it turns dark; elsewhere it follows the text colour
        const lime = root.dataset.accent === 'lime'
        root.style.setProperty('--cur', next === 'accent' ? (lime ? '#0b0a10' : '#a6e521') : 'var(--fg)')
      }
      if (t?.closest('input, textarea')) setMode('text')
      else if (t?.closest('a, button, [role="button"], label, .tcard')) setMode('link')
      else setMode('idle')
    }
    const down = () => setMode((m) => (m === 'text' ? m : 'down'))
    const up = () => setMode('idle')
    const leave = () => setSeen(false)

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    root.addEventListener('pointerleave', leave)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      root.removeEventListener('pointerleave', leave)
    }
  }, [x, y])

  if (!on) return null
  const hidden = !seen || mode === 'text'

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="cursor-part pointer-events-none fixed left-0 top-0 z-[200] size-9 rounded-full border-2"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%', borderColor: 'var(--cur, var(--fg))' }}
        animate={{ opacity: hidden ? 0 : 1, scale: mode === 'link' ? 1.9 : mode === 'down' ? 0.7 : 1 }}
        transition={{ duration: 0.25 }}
      >
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: 'var(--cur, var(--fg))' }}
          animate={{ opacity: mode === 'link' ? 0.28 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="cursor-part pointer-events-none fixed left-0 top-0 z-[200] size-2 rounded-full"
        style={{ x, y, translateX: '-50%', translateY: '-50%', background: 'var(--cur, var(--fg))' }}
        animate={{ opacity: hidden ? 0 : 1, scale: mode === 'link' ? 0.4 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
