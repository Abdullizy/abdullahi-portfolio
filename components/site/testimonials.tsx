'use client'

import { useState } from 'react'
import { AnimatePresence, motion, type PanInfo, type Variants } from 'framer-motion'
import { testimonials } from '@/lib/data'
import { ease } from '@/lib/motion'
import { Stretch } from './fx'

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const cardVariants: Variants = {
  enter: { opacity: 0, scale: 0.94, y: 28 },
  center: { opacity: 1, scale: 1, y: 0, x: 0, rotate: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * 380, rotate: d * 14, scale: 0.92 }),
}

// A deck of quote cards: drag or tap the top card and it flies off to reveal the next one.
export default function Testimonials() {
  const n = testimonials.length
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)

  if (n === 0) return null

  const go = (to: number, d: number) => {
    setDir(d)
    setActive(((to % n) + n) % n)
  }
  const next = () => go(active + 1, 1)
  const prev = () => go(active - 1, -1)

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80 || info.velocity.x < -500) next()
    else if (info.offset.x > 80 || info.velocity.x > 500) prev()
  }

  const t = testimonials[active]

  return (
    <section className="overflow-hidden px-5 pb-24 pt-8 sm:px-8 sm:pb-32" aria-label="Testimonials">
      <motion.h2
        className="t-section text-center font-medium"
        initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease }}
      ><Stretch>Kind words from{' '}
        <span className="font-serif text-[1.13em] font-normal italic tracking-normal text-accent-text">clients</span></Stretch></motion.h2>

      <div className="relative mx-auto mt-12 h-[400px] w-full max-w-[680px] sm:mt-16 sm:h-[360px]" style={{ touchAction: 'pan-y' }}>
        {/* cards waiting behind the top one */}
        <div className="absolute inset-0 translate-y-6 scale-[0.9] rotate-[2.5deg] rounded-[28px] border border-border bg-band" aria-hidden="true" />
        <div className="absolute inset-0 translate-y-3 scale-[0.95] -rotate-[2deg] rounded-[28px] border border-border bg-card/80" aria-hidden="true" />

        <AnimatePresence mode="popLayout" custom={dir} initial={false}>
          <motion.article
            key={active}
            custom={dir}
            className="absolute inset-0 flex cursor-grab flex-col justify-between overflow-hidden rounded-[28px] border border-border bg-card p-7 shadow-[0_30px_80px_-40px_var(--glow)] active:cursor-grabbing sm:p-10"
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease }}
            drag="x"
            dragSnapToOrigin
            dragElastic={0.6}
            whileDrag={{ rotate: 2 }}
            onDragEnd={onDragEnd}
            onTap={next}
          >
            <span className="pointer-events-none absolute -right-2 -top-6 select-none font-serif text-[200px] italic leading-none text-primary opacity-15" aria-hidden="true">
              &rdquo;
            </span>
            <div className="relative flex items-center justify-between">
              <span className="text-lg tracking-[5px] text-accent-text" aria-hidden="true">
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </span>
              <span className="font-mono text-sm text-muted-foreground">
                {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>
            </div>
            <blockquote className="relative font-serif text-[1.65rem] italic leading-[1.25] sm:text-[2.1rem]">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div className="relative flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary font-mono text-sm font-semibold text-primary-foreground">
                {initials(t.who)}
              </span>
              <span className="leading-snug">
                <strong className="block font-semibold">{t.who}</strong>
                <span className="block text-sm text-muted-foreground">{t.role}</span>
              </span>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="mx-auto mt-10 flex max-w-[680px] items-center gap-5">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous testimonial"
          className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border border-border bg-card transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div className="flex flex-1 gap-2" role="tablist" aria-label="Choose testimonial">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => go(i, i > active ? 1 : -1)}
              className="relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-border"
            >
              {i === active && <motion.span layoutId="t-progress" className="absolute inset-0 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next testimonial"
          className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border border-border bg-card transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  )
}
