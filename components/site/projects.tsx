'use client'

import { useState } from 'react'
import { projects } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Stretch } from './fx'
import { fadeUp } from '@/lib/motion'
import Tilt from './tilt'

export default function Projects() {
  const [open, setOpen] = useState<number | null>(null)
  const current = open !== null ? projects[open] : null

  return (
    <section id="work" className="relative pb-20 sm:pb-28">
      <div
        className="h-40 border-t-2 border-primary bg-gradient-to-b from-[var(--glow)] to-transparent opacity-50 sm:h-56"
        aria-hidden="true"
      />
      <div className="relative mx-auto -mt-20 w-full max-w-[1320px] px-5 sm:-mt-28 sm:px-8 lg:px-14">
        <motion.h2
          {...fadeUp()}
          className="text-center font-mono text-[clamp(2.4rem,1rem+5vw,5rem)] font-normal tracking-tight"
        ><Stretch>Projects</Stretch></motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-12 sm:mt-16 md:grid-cols-2 md:gap-10">
          {projects.map((p, i) => (
            <motion.div key={p.name + i} {...fadeUp((i % 2) * 0.12)} className="md:[&:nth-child(even)]:mt-14">
              <Tilt
                label="View"
                className={cn('h-[250px] w-full overflow-hidden bg-card sm:h-[320px] md:h-[440px]', `shape-${i % 4}`)}
                overlay={
                  <>
                    <span
                      className={cn(
                        'pointer-events-none absolute hidden bg-primary px-5 py-2.5 font-mono text-2xl text-primary-foreground md:block',
                        `tag-${i % 4}`,
                      )}
                    >
                      {p.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpen(i)}
                      aria-label={`Open ${p.name}`}
                      className="absolute inset-0 z-20 cursor-pointer"
                    />
                  </>
                }
              >
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" loading="lazy" className="size-full object-cover" />
                ) : (
                  <span className="flex size-full flex-col gap-3 p-6 pt-12 sm:p-10 sm:pt-16 md:pb-20" aria-hidden="true">
                    <span className="flex gap-1.5">
                      <i className="size-2 rounded-full bg-border" />
                      <i className="size-2 rounded-full bg-border" />
                      <i className="size-2 rounded-full bg-border" />
                    </span>
                    <span className="h-16 rounded-lg bg-border md:h-[90px]" />
                    <span className="flex flex-1 gap-3">
                      <i className="flex-[2] rounded-lg bg-border" />
                      <i className="flex-1 rounded-lg bg-soft" />
                    </span>
                  </span>
                )}
              </Tilt>

              {/* Mobile: title, text and button sit under the picture */}
              <div className="mt-5 md:hidden">
                <h3 className="text-2xl font-semibold tracking-tight">{p.name}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">{p.description}</p>
                <Button className="mt-4" onClick={() => setOpen(i)}>
                  View project
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          {current && (
            <>
              <div className="flex items-center justify-between gap-4">
                <DialogTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">{current.name}</DialogTitle>
                <DialogClose
                  aria-label="Close project"
                  className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 border-primary text-xl text-foreground"
                >
                  &times;
                </DialogClose>
              </div>
              <div className="mt-6 flex h-52 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-band text-sm text-muted-foreground sm:h-72">
                {current.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={current.image} alt={`${current.name} screenshot`} className="size-full object-cover" />
                ) : (
                  <span>Project screenshot goes here</span>
                )}
              </div>
              <DialogDescription className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {current.description}
              </DialogDescription>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {current.live && (
                  <Button asChild>
                    <a href={current.live} target="_blank" rel="noreferrer">
                      Visit live site
                    </a>
                  </Button>
                )}
                {current.source && (
                  <Button asChild variant="outline">
                    <a href={current.source} target="_blank" rel="noreferrer">
                      View source code
                    </a>
                  </Button>
                )}
                {!current.live && !current.source && (
                  <span className="text-muted-foreground">Links will be added soon.</span>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
