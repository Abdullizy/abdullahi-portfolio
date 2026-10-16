// Shared Framer Motion presets. Plain objects, so they can be spread onto
// `motion.*` elements from both server and client components.
export const ease = [0.2, 0.7, 0.2, 1] as const

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 48, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.85, delay, ease },
})

export const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.9, y: 30 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, delay, ease },
})
