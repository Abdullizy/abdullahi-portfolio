import { profile, marquee, services, focusChips, steps, statement } from '@/lib/data'
import { Icon } from '@/lib/icons'
import { cn } from '@/lib/utils'
import * as motion from 'framer-motion/client'
import { fadeUp, scaleIn } from '@/lib/motion'
import { NameFx, Stretch } from './fx'

const wrap = 'mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-14'
const sectionTitle = 't-section text-center font-medium'
const serifAccent = 'font-serif text-[1.13em] font-normal italic tracking-normal text-accent-text'
const card = 'rounded-lg border border-border bg-card'

export function Marquee() {
  const items = [...marquee, ...marquee]
  return (
    <div className="overflow-hidden border-y border-border bg-band py-5" aria-hidden="true">
      <div className="marquee-track">
        {items.map((label, i) => (
          <div
            key={i}
            className="flex items-center gap-8 whitespace-nowrap pr-8 text-xl font-semibold tracking-tight text-muted-foreground sm:gap-10 sm:pr-10 sm:text-[22px]"
          >
            {label}
            <span className="text-accent-text">&#10022;</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Services() {
  return (
    <section id="services" className={cn(wrap, 'py-20 sm:py-28 lg:py-32')}>
      <motion.h2 className={sectionTitle} {...fadeUp()}><Stretch>
        What I can build for <span className={serifAccent}>you</span>
      </Stretch></motion.h2>
      <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {services.map((s, i) => (
          <motion.article
            key={s.title}
            {...fadeUp((i % 3) * 0.1)}
            className={cn(card, 'lift p-7 sm:p-9', s.wide && 'md:col-span-2')}
          >
            <div className="flex size-14 items-center justify-center rounded-xl bg-soft text-accent-text">
              <Icon d={s.icon} size={28} />
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2.5 text-[17px] leading-relaxed text-muted-foreground">{s.text}</p>
            <p className="mt-5 text-[15px]">
              <span className="font-semibold text-accent-text">Good for: </span>
              {s.goodFor}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

const cardCopy = 'px-6 pb-7 sm:px-9 sm:pb-8'

const polar = (deg: number) => {
  const r = (deg * Math.PI) / 180
  return {
    left: `${(50 + 50 * Math.cos(r)).toFixed(2)}%`,
    top: `${(50 + 50 * Math.sin(r)).toFixed(2)}%`,
  }
}

function OrbitRing({ chips, className, dur, offset = 0, accentFirst = false }: { chips: string[]; className: string; dur: string; offset?: number; accentFirst?: boolean }) {
  return (
    <div className={cn('absolute rounded-full border border-dashed border-border', className)} style={{ ['--dur' as string]: dur }}>
      {chips.map((label, i) => (
        <span key={label} className="absolute -translate-x-1/2 -translate-y-1/2" style={polar(offset + (i * 360) / chips.length)}>
          <span
            className={cn(
              'chip block whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-xs sm:px-4 sm:py-2 sm:text-sm',
              accentFirst && i === 0
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-band text-foreground',
            )}
          >
            {label}
          </span>
        </span>
      ))}
    </div>
  )
}

const pipeline = [
  { label: 'Sketch', d: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z' },
  { label: 'Design', d: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
  { label: 'Code', d: 'M16 18l6-6-6-6M8 6l-6 6 6 6' },
  { label: 'Launch', d: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' },
]

export function Focus() {
  const inner = focusChips.slice(0, 4)
  const outer = focusChips.slice(4, 8)

  return (
    <section className={cn(wrap, 'pb-20 pt-6 sm:pb-28 lg:pt-12')} aria-label="What I focus on">
      <motion.h2 className={sectionTitle} {...fadeUp()}><Stretch>
        Focused on the <span className={serifAccent}>details</span>
      </Stretch></motion.h2>

      <div className="bend mt-12 grid grid-cols-1 gap-5 sm:mt-16 lg:grid-cols-2 lg:grid-rows-[300px_300px] lg:gap-6">
        {/* Tall: tech stack orbit */}
        <motion.div
          {...scaleIn()}
          className={cn(card, 'lift group relative min-h-[540px] overflow-hidden lg:row-span-2 lg:min-h-0')}
        >
          <div className="absolute inset-x-0 top-0 flex h-[calc(100%-150px)] items-center justify-center">
            <div className="relative aspect-square w-[min(80%,400px)]">
              <OrbitRing chips={outer} className="inset-[0%] orbit-rev" dur="46s" offset={45} />
              <OrbitRing chips={inner} className="inset-[24%] orbit" dur="30s" accentFirst />
              <div className="glow-pulse absolute left-1/2 top-1/2 grid size-[22%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary font-serif text-[clamp(2rem,6vw,3.2rem)] italic leading-none text-primary-foreground">
                A
              </div>
            </div>
          </div>
          <div className={cn(cardCopy, 'absolute inset-x-0 bottom-0 bg-gradient-to-t from-card from-70% to-transparent pt-8')}>
            <h3 className="text-[1.7rem] font-medium tracking-tight sm:text-3xl">
              <span className={serifAccent}>Modern</span> tech stack
            </h3>
            <p className="mt-2.5 text-base leading-relaxed text-muted-foreground sm:text-[17px]">
              HTML, CSS, JavaScript and React, plus AI tools that help me build faster and deliver sooner.
            </p>
          </div>
        </motion.div>

        {/* Design & build pipeline */}
        <motion.div
          {...scaleIn(0.12)}
          className={cn(card, 'lift flex min-h-[300px] flex-col justify-between overflow-hidden px-6 pb-7 pt-8 sm:px-9')}
        >
          <div className="relative flex items-start justify-between">
            <div className="absolute inset-x-6 top-6 h-0.5 bg-border sm:top-7">
              <span className="pipe-fill absolute inset-0 origin-left bg-primary" />
            </div>
            {pipeline.map((p, i) => (
              <div key={p.label} className="relative flex flex-col items-center gap-2.5">
                <span
                  className="pipe-node grid size-12 place-items-center rounded-2xl border border-border bg-band sm:size-14"
                  style={{ ['--i' as string]: i }}
                >
                  <Icon d={p.d} size={24} />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:text-xs">{p.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-[1.6rem] font-medium tracking-tight sm:text-[1.75rem]">
              Design &amp; <span className={serifAccent}>Build</span>
            </h3>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              I handle the look and the code, so your site feels consistent from first sketch to launch.
            </p>
          </div>
        </motion.div>

        {/* Open to projects: little chat */}
        <motion.div
          {...scaleIn(0.24)}
          className={cn(card, 'lift relative min-h-[330px] overflow-hidden bg-band lg:min-h-0')}
        >
          <div className="flex flex-col gap-2.5 px-6 pt-7 text-[15px] sm:px-9">
            <div className="bubble max-w-[82%] self-start rounded-2xl rounded-bl-sm bg-border px-4 py-2.5" style={{ ['--i' as string]: 0 }}>
              Hi! I need a website for my business.
            </div>
            <div
              className="bubble max-w-[82%] self-end rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground"
              style={{ ['--i' as string]: 1 }}
            >
              Sure, let&rsquo;s build it. When do you need it?
            </div>
            <div className="bubble flex w-16 items-center justify-center gap-1.5 self-start rounded-2xl rounded-bl-sm bg-border px-4 py-3.5" style={{ ['--i' as string]: 2 }}>
              <i className="dot size-1.5 rounded-full bg-muted-foreground" />
              <i className="dot size-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: '0.15s' }} />
              <i className="dot size-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
          <div className={cn(cardCopy, 'absolute inset-x-0 bottom-0 bg-gradient-to-t from-band from-60% to-transparent pt-12')}>
            <h3 className="text-[1.6rem] font-medium tracking-tight sm:text-[1.75rem]">
              Open to <span className={serifAccent}>new projects</span>
            </h3>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              From a one-page site to a full business website, I&rsquo;m ready to build it.
            </p>
          </div>
        </motion.div>
      </div>

      <div
        className="mx-auto mt-24 h-0.5 max-w-3xl bg-gradient-to-r from-transparent via-primary to-transparent sm:mt-32"
        aria-hidden="true"
      />
    </section>
  )
}

export function Process() {
  return (
    <section className={cn(wrap, 'py-16 sm:py-24')}>
      <motion.h2 className={sectionTitle} {...fadeUp()}><Stretch>
        From message to <span className={serifAccent}>live site</span>
      </Stretch></motion.h2>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {steps.map((s, i) => (
          <motion.div key={s.num} {...fadeUp(i * 0.12)} className="border-t-2 border-primary pt-5">
            <div className="font-mono text-sm text-muted-foreground">{s.num}</div>
            <h3 className="mt-2.5 text-2xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function About() {
  return (
    <section id="about" className={cn(wrap, 'py-12 sm:py-24')}>
      <motion.div {...fadeUp()} className={cn(card, 'p-7 sm:p-12 lg:p-16')}>
        <div className="font-mono text-sm tracking-wide text-accent-text">&gt; ABOUT</div>
        <h2 className="mt-3.5 text-[clamp(2rem,1rem+3.6vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.04em]">
          <Stretch>Hi, I&rsquo;m <span className={serifAccent}><NameFx text={profile.name} /></span>.</Stretch>
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          I&rsquo;m a {profile.role.toLowerCase()} based in {profile.city}. {profile.about1}
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{profile.about2}</p>
      </motion.div>
    </section>
  )
}

export function Statement() {
  return (
    <section
      className={cn(wrap, 'flex flex-wrap justify-center gap-x-4 pb-24 pt-8 text-center sm:gap-x-6 sm:pb-32')}
      aria-label="Closing statement"
    >
      {statement.map((w, i) => (
        <motion.span
          key={i}
          {...fadeUp(i * 0.07)}
          className={cn('t-statement inline-block font-medium', i >= 5 && 'text-accent-text')}
        >
          <Stretch>{w}</Stretch>
        </motion.span>
      ))}
    </section>
  )
}
