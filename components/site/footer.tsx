import { profile } from '@/lib/data'
import { NameFx } from './fx'
import CircleCta from './circle-cta'

export default function Footer() {
  const links = [
    { label: 'GitHub', href: profile.socials.github },
    { label: 'LinkedIn', href: profile.socials.linkedin },
    { label: 'X', href: profile.socials.x },
    { label: 'Instagram', href: profile.socials.instagram },
  ]

  return (
    <footer className="border-t border-border bg-band">
      <div className="mx-auto w-full max-w-[1320px] px-5 pb-10 pt-14 sm:px-8 lg:px-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <nav aria-label="Footer" className="flex flex-col gap-2 text-lg">
              <a className="transition-colors hover:text-accent-text" href="#work">Projects</a>
              <a className="transition-colors hover:text-accent-text" href="#services">Services</a>
              <a className="transition-colors hover:text-accent-text" href="#about">About</a>
              <a className="transition-colors hover:text-accent-text" href="#contact">Contact</a>
            </nav>
          </div>
          <div className="flex gap-5 sm:gap-7">
            <CircleCta href={`https://wa.me/${profile.whatsapp}`} label="Message me" tone="primary" external />
            <CircleCta href={`mailto:${profile.email}`} label="Email me" tone="light" delay={0.6} />
          </div>
        </div>

        <div className="mt-14 select-none font-serif text-[clamp(3.5rem,17vw,10rem)] italic leading-none text-foreground">
          <NameFx text={profile.name} />
        </div>

        <div className="mt-8 flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} <NameFx text={profile.name} /> - {profile.role}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <li key={l.label}>
                <a className="transition-colors hover:text-accent-text" href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
