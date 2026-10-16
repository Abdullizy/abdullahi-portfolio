'use client'

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* NameFx - your name: letters jump in a wave when you hover it        */
/* ------------------------------------------------------------------ */
export function NameFx({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn('name-fx', className)}>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="nm-c" style={{ ['--i' as string]: i }} aria-hidden="true">
          {ch}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Stretch - letters near the cursor stretch tall (like pulled elastic) */
/* ------------------------------------------------------------------ */
function splitNode(node: ReactNode, keyPrefix = 'k'): ReactNode {
  if (typeof node === 'string' || typeof node === 'number') {
    const words = String(node).split(/(\s+)/)
    return words.map((w, wi) => {
      if (w === '') return null
      if (/^\s+$/.test(w)) return ' '
      return (
        <span key={`${keyPrefix}-${wi}`} className="st-w">
          {Array.from(w).map((ch, ci) => (
            <span key={ci} data-c className="st-c">
              {ch}
            </span>
          ))}
        </span>
      )
    })
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>
    if (el.type === NameFx) return el // the name keeps its own special effect
    return cloneElement(el, undefined, splitNode(el.props.children, keyPrefix + 'c'))
  }
  if (Array.isArray(node)) {
    return Children.toArray(node).map((n, i) => (
      <span key={i} className="contents">
        {splitNode(n, `${keyPrefix}${i}`)}
      </span>
    ))
  }
  return node
}

export function Stretch({
  as: Tag = 'span',
  className,
  radius = 110,
  children,
}: {
  as?: ElementType
  className?: string
  radius?: number
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const raf = useRef(0)

  const apply = (x: number | null, y = 0) => {
    const chars = ref.current?.querySelectorAll<HTMLElement>('[data-c]')
    chars?.forEach((c) => {
      let f = 0
      if (x !== null) {
        const r = c.getBoundingClientRect()
        const dx = x - (r.left + r.width / 2)
        const dy = y - (r.top + r.height / 2)
        f = Math.exp(-((dx * dx + dy * dy) / (radius * radius)))
      }
      c.style.setProperty('--f', f.toFixed(3))
    })
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    cancelAnimationFrame(raf.current)
    const { clientX, clientY } = e
    raf.current = requestAnimationFrame(() => apply(clientX, clientY))
  }
  const onLeave = () => {
    cancelAnimationFrame(raf.current)
    apply(null)
  }

  return (
    <Tag ref={ref} className={className} onPointerMove={onMove} onPointerLeave={onLeave}>
      {splitNode(children)}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Typewrite - types the text out when it scrolls into view            */
/* ------------------------------------------------------------------ */
export function Typewrite({
  text,
  as: Tag = 'span',
  className,
  speed = 26,
  delay = 150,
}: {
  text: string
  as?: ElementType
  className?: string
  speed?: number
  delay?: number
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    let i = 0
    let tick: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      tick = setInterval(() => {
        i += 1
        setN(i)
        if (i >= text.length && tick) clearInterval(tick)
      }, speed)
    }, delay)
    return () => {
      clearTimeout(start)
      if (tick) clearInterval(tick)
    }
  }, [inView, text, speed, delay])

  const typing = inView && n < text.length
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {text.slice(0, n)}
        {typing && <span className="caret" />}
        <span className="invisible">{text.slice(n)}</span>
      </span>
    </Tag>
  )
}
