'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

// A round call-to-action that floats, leans toward the cursor, pulses,
// and fills with the opposite colour from below on hover.
export default function CircleCta({
  href,
  label,
  tone,
  external,
  delay = 0,
}: {
  href: string
  label: string
  tone: 'primary' | 'light'
  external?: boolean
  delay?: number
}) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 170, damping: 13 })
  const y = useSpring(my, { stiffness: 170, damping: 13 })

  const base = tone === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-foreground text-background'
  const fill = tone === 'primary' ? 'bg-foreground' : 'bg-primary'
  const hoverText = tone === 'primary' ? 'group-hover:text-background' : 'group-hover:text-primary-foreground'

  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <motion.div
        style={{ x, y }}
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse') return
          const r = e.currentTarget.getBoundingClientRect()
          mx.set((e.clientX - (r.left + r.width / 2)) * 0.3)
          my.set((e.clientY - (r.top + r.height / 2)) * 0.3)
        }}
        onPointerLeave={() => {
          mx.set(0)
          my.set(0)
        }}
      >
        <span className={cn('pulse-ring pointer-events-none absolute inset-0 rounded-full border-2', tone === 'primary' ? 'border-primary' : 'border-foreground/60')} style={{ animationDelay: `${delay}s` }} aria-hidden="true" />
        <motion.a
          href={href}
          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 300, damping: 16 }}
          className={cn('group relative flex size-32 items-center justify-center overflow-hidden rounded-full text-center text-lg font-semibold sm:size-36', base)}
        >
          <span className={cn('absolute inset-0 translate-y-full rounded-full transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:translate-y-0', fill)} aria-hidden="true" />
          <span className={cn('relative flex flex-col items-center gap-1 transition-colors duration-300', hoverText)}>
            {label}
            <span className="block -translate-x-1 translate-y-1 text-2xl leading-none opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true">
              &#8599;
            </span>
          </span>
        </motion.a>
      </motion.div>
    </motion.div>
  )
}
