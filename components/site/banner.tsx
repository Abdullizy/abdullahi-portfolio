import { banner } from '@/lib/data'

export default function Banner() {
  return (
    <section className="overflow-hidden py-10 lg:py-24" aria-label="My approach">
      <div className="morph -mx-[3%] w-[106%] bg-primary px-[9vw] py-16 text-primary-foreground sm:py-20 lg:px-[12vw] lg:py-32">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <p className="t-banner max-w-3xl font-medium lg:flex-1">
            {banner.text}
          </p>
          <div className="lg:w-72 lg:shrink-0 lg:-rotate-2">
            <p className="text-base leading-relaxed sm:text-lg">{banner.side}</p>
            <a
              href="#about"
              className="mt-7 inline-flex h-14 items-center justify-center gap-2 rounded-sm bg-[var(--know-bg)] px-7 font-medium text-[var(--know-fg)] transition-transform hover:-translate-y-0.5 lg:size-48 lg:rounded-full lg:text-lg"
            >
              Know More <span aria-hidden="true">&#8599;</span>
            </a>
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
