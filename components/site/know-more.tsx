'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'

// "Know more" button: on desktop it is a circle that leans toward your cursor,
// with a slowly turning text ring and soft pulses around it.
export default function KnowMore() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 180, damping: 14 })
  const y = useSpring(my, { stiffness: 180, damping: 14 })

  return (
    <motion.div
      className="relative mt-7 inline-block lg:mt-9"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - (r.left + r.width / 2)) * 0.28)
        my.set((e.clientY - (r.top + r.height / 2)) * 0.28)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      <span className="pulse-ring pointer-events-none absolute inset-0 hidden rounded-full border-2 border-white/50 lg:block" aria-hidden="true" />
      <span className="pulse-ring pointer-events-none absolute inset-0 hidden rounded-full border-2 border-white/50 [animation-delay:1.3s] lg:block" aria-hidden="true" />
      <svg className="spin-slow pointer-events-none absolute -inset-5 hidden size-[calc(100%+2.5rem)] lg:block" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path id="kmcircle" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
        </defs>
        <text className="fill-white/80 font-mono text-[13px] uppercase tracking-[0.2em]">
          <textPath href="#kmcircle">design • code • launch • design • code • launch •</textPath>
        </text>
      </svg>
      <a
        href="#about"
        className="relative inline-flex h-14 items-center justify-center gap-2 rounded-sm bg-[var(--know-bg)] px-7 font-medium text-[var(--know-fg)] transition-transform duration-300 hover:scale-105 lg:size-48 lg:rounded-full lg:text-lg"
      >
        Know More <span aria-hidden="true">&#8599;</span>
      </a>
    </motion.div>
  )
}
