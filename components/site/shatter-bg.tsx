'use client'

import { useEffect, useId, useMemo, useRef } from 'react'

// A big, faint "A" fixed behind the page. As you scroll it breaks into glass-like
// shards piece by piece, drifts apart, then pulls itself back together just
// before the Contact section. It sits behind everything and ignores the mouse.

const A_PATH = 'M60 6 L112 112 L86 112 L60 58 L34 112 L8 112 Z'
const X0 = 4, Y0 = 2, X1 = 140, Y1 = 116
const COLS = 8, ROWS = 7

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const r1 = (n: number) => Math.round(n * 10) / 10

type Shard = { points: string; dx: number; dy: number; rot: number; delay: number; cx: number; cy: number; alpha: number; hue: number; phase: number }

function buildShards(): Shard[] {
  const rand = rng(7)
  const cw = (X1 - X0) / COLS
  const ch = (Y1 - Y0) / ROWS
  // shared, slightly shaken grid points so the pieces tile with no gaps
  const pts: [number, number][][] = []
  for (let j = 0; j <= ROWS; j++) {
    const row: [number, number][] = []
    for (let i = 0; i <= COLS; i++) {
      const edgeX = i === 0 || i === COLS
      const edgeY = j === 0 || j === ROWS
      row.push([
        X0 + i * cw + (edgeX ? 0 : (rand() - 0.5) * cw * 0.7),
        Y0 + j * ch + (edgeY ? 0 : (rand() - 0.5) * ch * 0.7),
      ])
    }
    pts.push(row)
  }
  const shards: Shard[] = []
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const a = pts[j][i], b = pts[j][i + 1], c = pts[j + 1][i + 1], d = pts[j + 1][i]
      const tris = (i + j) % 2 === 0 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]]
      for (const t of tris) {
        const cx = (t[0][0] + t[1][0] + t[2][0]) / 3
        const cy = (t[0][1] + t[1][1] + t[2][1]) / 3
        let vx = cx - 70 + (rand() - 0.5) * 30
        let vy = cy - 60 + (rand() - 0.5) * 30
        const len = Math.hypot(vx, vy) || 1
        const dist = 35 + rand() * 90
        vx = (vx / len) * dist
        vy = (vy / len) * dist + 25 + rand() * 40 // a little gravity
        shards.push({
          points: t.map((p) => `${r1(p[0])},${r1(p[1])}`).join(' '),
          dx: r1(vx), dy: r1(vy), rot: r1((rand() - 0.5) * 140), delay: rand() * 0.55,
          cx: r1(cx), cy: r1(cy), alpha: 0.16 + rand() * 0.22, hue: Math.round(rand() * 360), phase: r1(rand() * 6.28),
        })
      }
    }
  }
  return shards
}

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const ease = (t: number) => t * t * (3 - 2 * t)

// Colours of the shards on the dark page: 'purple' = your accent colour, 'rainbow' = every piece a different colour.
const PAGE_COLORS: 'purple' | 'rainbow' = 'purple'

export default function ShatterBg({ variant = 'page', soft = false }: { variant?: 'page' | 'banner'; soft?: boolean }) {
  const uid = useId().replace(/:/g, '')
  const clipId = `shatter-a-${uid}`
  const onBanner = variant === 'banner'
  const shards = useMemo(buildShards, [])
  const refs = useRef<(SVGGElement | null)[]>([])
  const polys = useRef<(SVGPolygonElement | null)[]>([])

  useEffect(() => {
    let target = 0
    let cur = 0
    let raf = 0

    const paint = (s: number) => {
      const y = window.scrollY
      const light = document.documentElement.dataset.theme === 'light'
      shards.forEach((sh, i) => {
        const e = ease(clamp((s - sh.delay * 0.5) / 0.5))
        const g = refs.current[i]
        const poly = polys.current[i]
        if (!g || !poly) return
        // pieces keep wandering while you scroll, so they never freeze in place
        const wx = Math.sin(y / 210 + sh.phase) * 16 * e
        const wy = Math.cos(y / 250 + sh.phase * 1.3) * 16 * e
        const wr = Math.sin(y / 320 + sh.phase) * 30 * e
        g.setAttribute(
          'transform',
          `translate(${r1(sh.dx * e + wx)} ${r1(sh.dy * e + wy)}) rotate(${r1(sh.rot * e + wr)} ${sh.cx} ${sh.cy}) translate(${sh.cx} ${sh.cy}) scale(${r1((1 - 0.3 * e) * 100) / 100}) translate(${-sh.cx} ${-sh.cy})`,
        )
        g.style.opacity = String(1 - 0.25 * e)
        // colours slide around the wheel as the page scrolls
        if (onBanner) {
          // white pieces on the purple banner
          poly.setAttribute('fill', '#fff')
          poly.setAttribute('stroke', '#fff')
          poly.setAttribute('fill-opacity', String(soft ? 0.03 + sh.alpha * 0.2 : 0.1 + sh.alpha * 0.55))
          poly.setAttribute('stroke-opacity', soft ? '0.2' : '0.55')
        } else if (PAGE_COLORS === 'rainbow') {
          const col = `hsl(${(sh.hue + y * 0.07) % 360} 78% ${light ? 52 : 62}%)`
          poly.setAttribute('fill', col)
          poly.setAttribute('stroke', col)
        }
      })
    }

    const readTarget = () => {
      const y = window.scrollY
      const h = window.innerHeight
      const c = document.getElementById('contact')
      const contactTop = c ? c.getBoundingClientRect().top + y : document.documentElement.scrollHeight
      const X = Math.max(h, contactTop - h) // scroll position where Contact starts to appear
      // a bell curve: it is whole at the top, most broken around the middle,
      // and whole again by the time Contact comes into view
      const p = clamp((y - 0.05 * h) / (X * 0.97 - 0.05 * h))
      target = Math.pow(Math.sin(Math.PI * p), 0.7)
    }

    const loop = () => {
      cur += (target - cur) * 0.14
      if (Math.abs(target - cur) < 0.0015) cur = target
      paint(cur)
      raf = Math.abs(target - cur) > 0 ? requestAnimationFrame(loop) : 0
    }
    const kick = () => {
      readTarget()
      paint(cur) // wander + colour follow the scroll straight away
      if (!raf) raf = requestAnimationFrame(loop)
    }

    kick()
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    const t = setTimeout(kick, 1500) // page height settles after fonts and images load
    return () => {
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
      clearTimeout(t)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [shards, onBanner, soft])

  return (
    <div
      className={
        onBanner
          ? 'pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden'
          : 'pointer-events-none fixed inset-0 -z-10 flex items-center justify-center overflow-hidden'
      }
      aria-hidden="true"
    >
      <svg viewBox="0 0 140 120" className="h-auto overflow-visible" style={{ width: onBanner ? 'min(64vw, 760px)' : 'min(96vw, 108vh)' }}>
        <defs>
          <clipPath id={clipId}>
            <path d={A_PATH} />
            <path d="M50 88 L74 88 L70 100 L46 100 Z" />
            <circle cx="128" cy="106" r="8" />
          </clipPath>
        </defs>
        {shards.map((sh, i) => (
          <g key={i} ref={(el) => { refs.current[i] = el }}>
            <g clipPath={`url(#${clipId})`}>
              <polygon ref={(el) => { polys.current[i] = el }} points={sh.points} fill="var(--accent)" fillOpacity={sh.alpha} stroke="var(--accent)" strokeOpacity={0.45} strokeWidth={0.35} />
            </g>
          </g>
        ))}
      </svg>
    </div>
  )
}
