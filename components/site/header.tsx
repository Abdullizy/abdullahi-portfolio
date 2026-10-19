'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '@/lib/data'
import { ease } from '@/lib/motion'
import Logo from './logo'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'

const links = [
  { href: '#work', label: 'Projects', hint: 'Things I have built' },
  { href: '#services', label: 'Services', hint: 'What I can build for you' },
  { href: '#about', label: 'About', hint: 'Who is behind the code' },
  { href: '#contact', label: 'Contact', hint: 'Start a project' },
]

type Theme = 'dark' | 'light'

// The Menu button drops its colour down and swaps to the next one every 5 seconds.
const menuColors = [
  { bg: 'var(--accent)', fg: 'var(--on-accent)' },
  { bg: '#ec4899', fg: '#ffffff' },
  { bg: '#f97316', fg: '#ffffff' },
  { bg: '#0d9488', fg: '#ffffff' },
]

export default function Header() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [open, setOpen] = useState(false)
  const [ci, setCi] = useState(0)

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) ?? 'dark')
  }, [])

  useEffect(() => {
    const t = setInterval(() => setCi((c) => (c + 1) % menuColors.length), 5000)
    return () => clearInterval(t)
  }, [])

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      window.localStorage.setItem('theme', next)
    } catch {
      /* ignore */
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0B0A10' : '#FAF9FD')
    setTheme(next)
  }

  return (
    <>
      <a className="site-logo logo-chip fixed left-3 top-3 z-40 flex items-center justify-center p-2 sm:left-8 sm:top-5" href="/" aria-label="Reload the home page">
        <Logo className="h-auto w-9 sm:w-11" />
      </a>

      <div className="fixed right-3 top-3 z-50 flex items-center gap-2 sm:right-8 sm:top-5">
        <Button
          variant="secondary"
          size="icon"
          shape="pill"
          className="size-11 shadow-[0_0_0_3px_var(--bg)] sm:size-12"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        </Button>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="menu-cut group relative flex h-11 cursor-pointer items-center gap-3 pl-5 pr-4 sm:h-12 sm:pl-6 sm:pr-5"
          style={{ color: menuColors[ci].fg, transition: 'color 0.4s' }}
        >
          {/* colour layers: the new one slides in from the top while the old one drops out the bottom */}
          <AnimatePresence initial={false}>
            <motion.span
              key={ci}
              className="absolute inset-0"
              style={{ background: menuColors[ci].bg }}
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
              aria-hidden="true"
            />
          </AnimatePresence>
          {/* the word rolls up on hover */}
          <span className="relative z-10 block h-[1.25em] overflow-hidden font-mono text-sm font-semibold uppercase leading-[1.25] tracking-[0.18em] sm:text-[15px]">
            <span className="block transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:-translate-y-full">Menu</span>
            <span className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:-translate-y-full">Open</span>
          </span>
          {/* two bars that slide apart, then lean into a cross */}
          <span className="relative z-10 block h-3 w-6" aria-hidden="true">
            <i className="absolute left-0 top-0 h-0.5 w-full origin-left bg-current transition-all duration-300 group-hover:w-3/4" />
            <i className="absolute bottom-0 right-0 h-0.5 w-full origin-right bg-current transition-all duration-300 group-hover:w-1/2" />
          </span>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="inset-y-0 left-auto right-0 top-0 flex h-dvh max-h-none w-full max-w-[480px] translate-x-0 translate-y-0 flex-col overflow-y-auto rounded-none rounded-l-[28px] border-y-0 border-r-0 border-l border-border bg-card p-7 animate-[sheetIn_0.5s_cubic-bezier(0.2,0.7,0.2,1)_both] sm:p-10"
        >
          <DialogTitle className="sr-only">Menu</DialogTitle>
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm tracking-[0.2em] text-muted-foreground">NAVIGATE</span>
            <DialogClose
              aria-label="Close menu"
              className="grid size-11 cursor-pointer place-items-center rounded-full border border-border text-2xl leading-none transition-transform duration-300 hover:rotate-90 hover:border-primary"
            >
              &times;
            </DialogClose>
          </div>

          <ul className="mt-10 flex flex-1 flex-col justify-center gap-2 sm:mt-14">
            {links.map((l, i) => (
              <motion.li
                key={l.href}
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease }}
              >
                <DialogClose asChild>
                  <a href={l.href} className="menu-link group flex items-baseline gap-4 border-b border-border py-4">
                    <span className="font-mono text-sm text-accent-text">0{i + 1}</span>
                    <span className="flex-1">
                      <span className="block text-[2.1rem] font-medium leading-none tracking-tight transition-all duration-300 group-hover:translate-x-2 group-hover:font-serif group-hover:italic group-hover:text-accent-text sm:text-5xl">
                        {l.label}
                      </span>
                      <span className="mt-2 block text-sm text-muted-foreground">{l.hint}</span>
                    </span>
                    <span className="text-2xl text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent-text" aria-hidden="true">
                      &#8599;
                    </span>
                  </a>
                </DialogClose>
              </motion.li>
            ))}
          </ul>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease }}
          >
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
              </span>
              Open to new projects
            </p>
            <a className="mt-2 block text-lg font-medium transition-colors hover:text-accent-text" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  )
}
