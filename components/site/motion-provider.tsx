'use client'

import { MotionConfig } from 'framer-motion'

// Always plays the animations, even if the PC has "Show animations" switched off.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>
}
