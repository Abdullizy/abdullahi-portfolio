'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '@/lib/data'
import { NameFx } from './fx'

type Seg = { text: string; className?: string; br?: boolean }

const segs: Seg[] = [
  { text: 'Hello, World!' },
  { text: '', br: true },
  { text: 'I’m ' },
  { text: profile.name, className: 'font-serif text-[1.12em] font-normal italic tracking-normal text-accent-text' },
]
const total = segs.reduce((n, s) => n + s.text.length, 0)
const label = `Hello, World! I’m ${profile.name}`

const greetings = [
  'Hello, World!',
  'Ciao, Mondo!',
  'Bonjour, Monde!',
  'Hola, Mundo!',
  'Hallo, Welt!',
  'Sannu, Duniya!',
  'Salaam, Dunya!',
]

// After the heading has been typed, the greeting keeps changing language.
function Greeting() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % greetings.length), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="relative inline-block overflow-hidden whitespace-nowrap align-bottom" style={{ paddingBottom: '0.1em', marginBottom: '-0.1em' }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: '105%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-105%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
        >
          {greetings[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// Types the hero heading out letter by letter. All the text is always in the
// layout (just invisible until typed), so nothing jumps around while it types.
export default function TypewriterHeading({ className }: { className?: string }) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const introSkipped = document.documentElement.dataset.intro === 'off'
    let i = 0
    let tick: ReturnType<typeof setInterval> | undefined
    let hide: ReturnType<typeof setTimeout> | undefined
    const start = setTimeout(() => {
      tick = setInterval(() => {
        i += 1
        setCount(i)
        if (i >= total) {
          if (tick) clearInterval(tick)
          hide = setTimeout(() => setDone(true), 2200)
        }
      }, 70)
    }, introSkipped ? 300 : 2700)
    return () => {
      clearTimeout(start)
      if (tick) clearInterval(tick)
      if (hide) clearTimeout(hide)
    }
  }, [])

  let offset = 0
  return (
    <h1 className={className} aria-label={label}>
      <span aria-hidden="true">
        {segs.map((s, idx) => {
          if (s.br) return <br key={idx} />
          const typed = Math.max(0, Math.min(s.text.length, count - offset))
          const here = !done && count >= offset && (count < offset + s.text.length || (count === offset + s.text.length && idx === segs.length - 1))
          offset += s.text.length
          return (
            <span key={idx} className={s.className}>
              {idx === 0 && done ? <Greeting /> : typed === s.text.length && s.text === profile.name ? <NameFx text={s.text} /> : s.text.slice(0, typed)}
              {here && <span className="caret" />}
              {!(idx === 0 && done) && <span className="invisible">{s.text.slice(typed)}</span>}
            </span>
          )
        })}
      </span>
    </h1>
  )
}
