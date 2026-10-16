import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { CSSProperties } from 'react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Animation delay that waits for the intro loader (0s when the intro is skipped). */
export function after(seconds: number): CSSProperties {
  return { ['--d' as string]: `calc(var(--intro) + ${seconds}s)` } as CSSProperties
}
