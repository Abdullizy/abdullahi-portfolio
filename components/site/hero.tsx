import { profile } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Icon, chatIcon, socialIcons, socialLabels, type SocialKey } from '@/lib/icons'
import { after } from '@/lib/utils'
import Tilt from './tilt'
import TypewriterHeading from './typewriter-heading'

export default function Hero() {
  const keys = Object.keys(socialIcons) as SocialKey[]

  return (
    <section id="top" className="grid-bg relative overflow-hidden">
      <div
        className="orb pointer-events-none absolute -right-28 -top-40 size-[420px] rounded-full bg-[var(--orb)] blur-[110px] lg:size-[600px] lg:blur-[130px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col items-center gap-9 px-5 pb-20 pt-28 sm:px-8 lg:flex-row lg:items-center lg:gap-14 lg:px-14 lg:pb-28 lg:pt-28">
        <div
          className="rise aspect-[4/4.2] w-full max-w-[300px] shrink-0 sm:aspect-[500/640] sm:max-w-[400px] lg:w-[clamp(340px,40vw,500px)] lg:max-w-none"
          style={after(0.1)}
        >
          <Tilt
            max={7}
            shift={8}
            className="clip-photo size-full overflow-hidden bg-primary text-center text-sm font-medium text-primary-foreground"
          >
            <div className="flex size-full items-center justify-center">
              {profile.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photo} alt={`Portrait of ${profile.name}`} className="size-full object-cover" />
              ) : (
                <span className="px-6">Add your photo in lib/data.ts</span>
              )}
            </div>
          </Tilt>
        </div>

        <div className="w-full min-w-0 flex-1">
          <TypewriterHeading className="t-hero font-medium tracking-[-0.045em]" />
          <p className="rise mt-6 max-w-[34rem] text-base leading-relaxed text-muted-foreground sm:text-xl lg:text-[clamp(1.1rem,1.5vw,1.5rem)]" style={after(0.95)}>
            {profile.headline}
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3 sm:gap-4" style={after(1.1)}>
            <Button asChild size="lg" className="flex-1 sm:flex-none">
              <a href="#work">My Projects</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1 sm:flex-none">
              <a href="#contact">Start a project</a>
            </Button>
          </div>
          <div className="rise mt-6 flex flex-wrap gap-3" style={after(1.25)}>
            {keys.map((k) => (
              <a
                key={k}
                href={profile.socials[k]}
                aria-label={socialLabels[k]}
                target="_blank"
                rel="noreferrer"
                className="flex size-14 items-center justify-center border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground sm:size-16"
              >
                <Icon d={socialIcons[k]} size={26} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <Button
        asChild
        size="icon"
        shape="pill"
        className="float-y fixed bottom-5 right-4 z-40 size-14 shadow-[0_16px_40px_-12px_var(--glow)] sm:bottom-8 sm:right-8 sm:size-[68px]"
      >
        <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat with me on WhatsApp">
          <Icon d={chatIcon} size={28} />
        </a>
      </Button>
    </section>
  )
}
