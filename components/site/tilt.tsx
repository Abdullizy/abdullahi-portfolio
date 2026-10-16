'use client'

import { useRef, type PointerEvent, type ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

type TiltProps = {
  children: ReactNode // the picture: it zooms and slides (parallax) inside the frame
  overlay?: ReactNode // stays still above the picture (tags, buttons)
  label?: string // text for the bubble that follows the cursor
  className?: string
  max?: number // max tilt in degrees
  shift?: number // picture parallax in px
}

// 3D tilt + parallax + light sheen + cursor bubble. Mouse only; touch screens skip it.
export default function Tilt({ children, overlay, label, className, max = 8, shift = 14 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null)

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const hover = useMotionValue(0)

  const sx = useSpring(px, { stiffness: 170, damping: 18, mass: 0.6 })
  const sy = useSpring(py, { stiffness: 170, damping: 18, mass: 0.6 })
  const sh = useSpring(hover, { stiffness: 200, damping: 24 })

  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const imgX = useTransform(sx, [0, 1], [shift, -shift])
  const imgY = useTransform(sy, [0, 1], [shift, -shift])
  const imgScale = useTransform(sh, [0, 1], [1, 1.14])
  const lift = useTransform(sh, [0, 1], [0, -8])

  const xPct = useTransform(sx, (v) => `${v * 100}%`)
  const yPct = useTransform(sy, (v) => `${v * 100}%`)
  const sheen = useMotionTemplate`radial-gradient(380px circle at ${xPct} ${yPct}, rgba(255,255,255,0.2), transparent 60%)`

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') hover.set(1)
  }
  const onLeave = () => {
    hover.set(0)
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      style={{ rotateX, rotateY, y: lift, transformPerspective: 1000 }}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <motion.div className="size-full" style={{ x: imgX, y: imgY, scale: imgScale }}>
        {children}
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: sheen, opacity: sh }} aria-hidden="true" />
      {label && (
        <motion.span
          className="pointer-events-none absolute z-10 grid size-24 place-items-center rounded-full bg-primary text-center text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-8px_var(--glow)]"
          style={{ left: xPct, top: yPct, x: '-50%', y: '-50%', opacity: sh, scale: sh }}
          aria-hidden="true"
        >
          {label}
        </motion.span>
      )}
      {overlay}
    </motion.div>
  )
}
