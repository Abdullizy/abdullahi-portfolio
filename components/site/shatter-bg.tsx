'use client'

import { useEffect, useRef } from 'react'

// A big, faint "A" behind the page. As you scroll it breaks into glass-like shards
// piece by piece, drifts apart, then pulls itself back together just before the
// Contact section. It sits behind everything and ignores the mouse.
//
// Speed notes: it is drawn on ONE <canvas> (not 100+ SVG elements), the shapes are
// pre-built once, the page height is measured only on resize (never while scrolling),
// and copies that are off screen (banner, contact) stop drawing completely.

// 'purple' = your accent colour, 'rainbow' = every piece a different colour.
const PAGE_COLORS: 'purple' | 'rainbow' = 'purple'

type Pt = [number, number]
const COLS = 8, ROWS = 7
const X0 = 4, Y0 = 2, X1 = 140, Y1 = 116

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// The "A" mark split into convex pieces (so triangles can be cut to its exact shape once, up front)
const circle: Pt[] = Array.from({ length: 14 }, (_, i) => [128 + 8 * Math.cos((i / 14) * Math.PI * 2), 106 + 8 * Math.sin((i / 14) * Math.PI * 2)])
const A_PIECES: Pt[][] = [
  [[60, 6], [60, 58], [34, 112], [8, 112]],
  [[60, 6], [112, 112], [86, 112], [60, 58]],
  [[50, 88], [74, 88], [70, 100], [46, 100]],
  circle,
]

const area = (p: Pt[]) => p.reduce((a, q, i) => a + (q[0] * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * q[1]), 0) / 2

// Sutherland-Hodgman: cut a polygon with a convex polygon
function clipConvex(subject: Pt[], clip: Pt[]): Pt[] {
  const sign = area(clip) > 0 ? 1 : -1
  const side = (a: Pt, b: Pt, p: Pt) => ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) * sign
  let out = subject
  for (let i = 0; i < clip.length && out.length; i++) {
    const a = clip[i], b = clip[(i + 1) % clip.length]
    const input = out
    out = []
    for (let j = 0; j < input.length; j++) {
      const p = input[j], q = input[(j + 1) % input.length]
      const sp = side(a, b, p), sq = side(a, b, q)
      const cross = (): Pt => {
        const t = sp / (sp - sq)
        return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
      }
      if (sp >= 0 && sq >= 0) out.push(q)
      else if (sp >= 0) out.push(cross())
      else if (sq >= 0) {
        out.push(cross())
        out.push(q)
      }
    }
  }
  return out
}

type Shard = { path: Path2D; dx: number; dy: number; rot: number; delay: number; cx: number; cy: number; alpha: number; hue: number; phase: number }

let cache: Shard[] | null = null
function buildShards(): Shard[] {
  if (cache) return cache
  const rand = rng(7)
  const cw = (X1 - X0) / COLS
  const ch = (Y1 - Y0) / ROWS
  const pts: Pt[][] = []
  for (let j = 0; j <= ROWS; j++) {
    const row: Pt[] = []
    for (let i = 0; i <= COLS; i++) {
      const edgeX = i === 0 || i === COLS
      const edgeY = j === 0 || j === ROWS
      row.push([X0 + i * cw + (edgeX ? 0 : (rand() - 0.5) * cw * 0.7), Y0 + j * ch + (edgeY ? 0 : (rand() - 0.5) * ch * 0.7)])
    }
    pts.push(row)
  }
  const shards: Shard[] = []
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const a = pts[j][i], b = pts[j][i + 1], c = pts[j + 1][i + 1], d = pts[j + 1][i]
      const tris = (i + j) % 2 === 0 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]]
      for (const t of tris) {
        // random numbers are always drawn, so the layout stays the same whatever gets dropped
        const cx = (t[0][0] + t[1][0] + t[2][0]) / 3
        const cy = (t[0][1] + t[1][1] + t[2][1]) / 3
        let vx = cx - 70 + (rand() - 0.5) * 30
        let vy = cy - 60 + (rand() - 0.5) * 30
        const len = Math.hypot(vx, vy) || 1
        const dist = 35 + rand() * 90
        vx = (vx / len) * dist
        vy = (vy / len) * dist + 25 + rand() * 40
        const rot = (rand() - 0.5) * 140
        const delay = rand() * 0.55
        const alpha = 0.16 + rand() * 0.22
        const hue = Math.round(rand() * 360)
        const phase = rand() * 6.28

        const path = new Path2D()
        let any = false
        for (const piece of A_PIECES) {
          const poly = clipConvex(t, piece)
          if (poly.length < 3 || Math.abs(area(poly)) < 0.4) continue
          any = true
          poly.forEach((p, k) => (k ? path.lineTo(p[0], p[1]) : path.moveTo(p[0], p[1])))
          path.closePath()
        }
        if (any) shards.push({ path, dx: vx, dy: vy, rot: (rot * Math.PI) / 180, delay, cx, cy, alpha, hue, phase })
      }
    }
  }
  cache = shards
  return shards
}

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const ease = (t: number) => t * t * (3 - 2 * t)

export default function ShatterBg({ variant = 'page', soft = false }: { variant?: 'page' | 'banner'; soft?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onBanner = variant === 'banner'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const shards = buildShards()

    let w = 0, h = 0, dpr = 1
    let contactTop = 0
    let accent = '#7c3aed'
    let light = false
    let visible = true
    let target = 0
    let cur = 0
    let lastY = -1
    let raf = 0

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement)
      accent = cs.getPropertyValue('--accent').trim() || accent
      light = document.documentElement.dataset.theme === 'light'
    }
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      // faint shapes do not need to be sharp: the full-screen copy renders at reduced resolution
      dpr = onBanner ? Math.min(window.devicePixelRatio || 1, 1.25) : 0.75
      w = r.width
      h = r.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      const c = document.getElementById('contact')
      contactTop = c ? c.getBoundingClientRect().top + window.scrollY : document.documentElement.scrollHeight
      schedule()
    }

    const readTarget = (y: number) => {
      const vh = window.innerHeight
      const X = Math.max(vh, contactTop - vh) // scroll position where Contact starts to appear
      // a bell curve: whole at the top, most broken in the middle, whole again before Contact
      const p = clamp((y - 0.05 * vh) / (X * 0.97 - 0.05 * vh))
      target = Math.pow(Math.sin(Math.PI * p), 0.7)
    }

    const draw = (s: number, y: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const size = onBanner ? Math.min(window.innerWidth * 0.64, 760) : Math.min(window.innerWidth * 0.96, window.innerHeight * 1.08)
      const u = (size / 140) * dpr
      const ox = (canvas.width - 140 * u) / 2
      const oy = (canvas.height - 120 * u) / 2
      ctx.lineJoin = 'round'
      for (let i = 0; i < shards.length; i++) {
        const sh = shards[i]
        const e = ease(clamp((s - sh.delay * 0.5) / 0.5))
        // pieces keep wandering while you scroll, so they never freeze in place
        const wx = Math.sin(y / 210 + sh.phase) * 16 * e
        const wy = Math.cos(y / 250 + sh.phase * 1.3) * 16 * e
        const wr = (Math.sin(y / 320 + sh.phase) * 30 * e * Math.PI) / 180
        const sc = 1 - 0.3 * e
        ctx.setTransform(u, 0, 0, u, ox, oy)
        ctx.translate(sh.dx * e + wx, sh.dy * e + wy)
        ctx.translate(sh.cx, sh.cy)
        ctx.rotate(sh.rot * e + wr)
        ctx.scale(sc, sc)
        ctx.translate(-sh.cx, -sh.cy)
        const fade = 1 - 0.25 * e
        let fill = accent
        let fa = sh.alpha * fade
        let sa = 0.45 * fade
        if (onBanner) {
          fill = '#fff'
          fa = (soft ? 0.03 + sh.alpha * 0.2 : 0.1 + sh.alpha * 0.55) * fade
          sa = (soft ? 0.2 : 0.55) * fade
        } else if (PAGE_COLORS === 'rainbow') {
          fill = `hsl(${(sh.hue + y * 0.07) % 360} 78% ${light ? 52 : 62}%)`
        }
        ctx.lineWidth = 0.35
        ctx.fillStyle = fill
        ctx.strokeStyle = fill
        ctx.globalAlpha = fa
        ctx.fill(sh.path)
        ctx.globalAlpha = sa
        ctx.stroke(sh.path)
      }
      ctx.globalAlpha = 1
    }

    const frame = () => {
      raf = 0
      if (!visible) return
      const y = window.scrollY
      readTarget(y)
      // follow quickly: the further behind it is, the faster it catches up
      const gap = target - cur
      cur += gap * Math.min(0.85, 0.22 + Math.abs(gap) * 1.2)
      if (Math.abs(target - cur) < 0.002) cur = target
      draw(cur, y)
      const moving = cur !== target || y !== lastY
      lastY = y
      if (moving) raf = requestAnimationFrame(frame)
    }
    function schedule() {
      if (!raf && visible) raf = requestAnimationFrame(frame)
    }

    readTheme()
    resize()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', resize)
    const ro = new ResizeObserver(resize)
    ro.observe(document.body)
    const settle = setTimeout(resize, 1500) // page height settles after fonts and images load
    const mo = new MutationObserver(() => {
      readTheme()
      schedule()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-accent'] })

    // copies inside sections stop drawing while they are off screen
    let io: IntersectionObserver | undefined
    if (onBanner) {
      visible = false
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible) schedule()
      })
      io.observe(canvas)
    }

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', resize)
      ro.disconnect()
      mo.disconnect()
      io?.disconnect()
      clearTimeout(settle)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [onBanner, soft])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={
        onBanner
          ? 'pointer-events-none absolute inset-0 size-full'
          : 'pointer-events-none fixed inset-0 -z-10 h-dvh w-screen'
      }
    />
  )
}
