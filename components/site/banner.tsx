import { banner } from '@/lib/data'
import { Typewrite } from './fx'
import KnowMore from './know-more'
import ShatterBg from './shatter-bg'

export default function Banner() {
  return (
    <section className="overflow-hidden py-10 lg:py-24" aria-label="My approach">
      <div className="morph relative -mx-[3%] w-[106%] overflow-hidden bg-primary px-[9vw] py-16 text-primary-foreground sm:py-20 lg:px-[12vw] lg:py-32">
        {/* the shattering "A" again, in light colours that show up on purple */}
        <ShatterBg variant="banner" />
        {/* soft shapes that drift slowly behind the text */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="orb absolute -left-24 top-10 size-72 rounded-full bg-white/10 sm:size-[26rem]" style={{ animationDuration: '19s' }} />
          <span className="orb absolute -bottom-32 right-[18%] size-72 rounded-full bg-black/15 sm:size-[24rem]" style={{ animationDuration: '23s', animationDelay: '-6s' }} />
          <span className="float-y absolute right-[8%] top-[14%] size-6 rounded-full bg-white/40" />
          <span className="float-y absolute bottom-[16%] left-[10%] size-4 rounded-full bg-white/30" style={{ animationDelay: '-2s' }} />
          <span className="float-y absolute left-[46%] top-[8%] size-3 rounded-full bg-white/40" style={{ animationDelay: '-3.5s' }} />
        </div>
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <Typewrite as="p" text={banner.text} className="t-banner max-w-3xl font-medium lg:flex-1" speed={24} />
          <div className="lg:w-72 lg:shrink-0 lg:-rotate-2">
            <Typewrite as="p" text={banner.side} className="text-base leading-relaxed sm:text-lg" speed={18} delay={1200} />
            <KnowMore />
          </div>
        </div>

        {banner.showStats && banner.stats.length > 0 && (
          <div className="mt-14 text-center lg:mt-20">
            <p className="text-2xl tracking-tight sm:text-3xl">{banner.statsTitle}</p>
            <div className="mx-auto mt-8 flex max-w-md flex-col lg:mt-10 lg:max-w-none lg:flex-row lg:justify-center">
              {banner.stats.map((s, i) => (
                <div
                  key={s.label}
                  className="border-[var(--stat-line)] py-6 not-last:border-b lg:px-12 lg:py-0 lg:not-last:border-b-0 lg:not-last:border-r"
                >
                  <div className="font-mono text-5xl font-semibold tracking-tight lg:text-[3.4rem]">{s.num}</div>
                  <div className="mt-1 text-base sm:text-lg">{s.label}</div>
                  <span className="sr-only">{i}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
