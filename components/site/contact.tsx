'use client'

import { useState, type FormEvent } from 'react'
import { profile } from '@/lib/data'
import { Stretch } from './fx'
import ShatterBg from './shatter-bg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { ease, fadeUp } from '@/lib/motion'

const WAVE = 'M0 100 C200 20 400 20 600 100 C800 180 1000 180 1200 100 C1400 20 1600 20 1800 100 C2000 180 2200 180 2400 100 L2400 200 L0 200 Z'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function Contact() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trap = e.currentTarget.elements.namedItem('_gotcha') as HTMLInputElement | null
    if (trap?.value) return // spam trap

    if (profile.formEndpoint) {
      try {
        setStatus('sending')
        const res = await fetch(profile.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email, message: 'New enquiry from your portfolio website.' }),
        })
        if (!res.ok) throw new Error('bad response')
        setStatus('sent')
        setEmail('')
      } catch {
        setStatus('error')
      }
      return
    }

    const subject = encodeURIComponent('New website project enquiry')
    const body = encodeURIComponent(
      `Hi ${profile.name},\n\nI'd like to talk about a project. You can reach me at ${email}.`,
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setStatus('sent')
  }

  return (
    <section id="contact" className="mx-auto w-full max-w-[1320px] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-14">
      <motion.div {...fadeUp()} className="contact-shape relative overflow-hidden bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 sm:py-20 lg:py-24">
        <ShatterBg variant="banner" soft />
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] sm:h-[40%]"
          initial={{ y: 90, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
          aria-hidden="true"
        >
          <svg className="wave wave-rev absolute bottom-0 h-full w-[200%] fill-black/10" viewBox="0 0 2400 200" preserveAspectRatio="none">
            <path d={WAVE} />
          </svg>
          <svg className="wave absolute bottom-0 h-[72%] w-[200%] fill-black/20" viewBox="0 0 2400 200" preserveAspectRatio="none">
            <path d={WAVE} />
          </svg>
        </motion.div>
        <h2 className="t-contact relative mx-auto max-w-3xl font-medium"><Stretch>Have a project in mind? Let&rsquo;s{' '}
          <span className="font-serif text-[1.13em] font-normal italic tracking-normal">talk.</span></Stretch></h2>
        <p className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-xl">
          Drop your email and tell me what you need. I&rsquo;ll reply within {profile.replyTime} with a clear next step.
        </p>

        <form
          onSubmit={onSubmit}
          className="relative mx-auto mt-9 flex w-full max-w-[640px] items-center gap-2 rounded-full bg-[var(--pill)] py-2 pl-6 pr-2 sm:pl-8"
        >
          <label className="sr-only" htmlFor="contact-email">
            Your email address
          </label>
          <Input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Drop your email here..."
            autoComplete="email"
            className="text-base sm:text-lg"
          />
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <Button
            type="submit"
            variant="onAccent"
            size="icon"
            shape="pill"
            className="size-12 sm:size-14"
            disabled={status === 'sending'}
            aria-label="Send my email"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </Button>
        </form>
        <p className="relative mt-3 min-h-6 text-sm sm:text-base" role="status">
          {status === 'sent' && 'Thank you! I will get back to you soon.'}
          {status === 'error' && 'Something went wrong. Please try WhatsApp or email instead.'}
        </p>

        <div className="relative mt-5 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Button asChild variant="outlineOnAccent" size="lg">
            <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outlineOnAccent" size="lg">
            <a href={`mailto:${profile.email}`}>Email me</a>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
