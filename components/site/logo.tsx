export default function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 140 120" aria-hidden="true">
      <path className="logo-main" d="M60 6 L112 112 L86 112 L60 58 L34 112 L8 112 Z" />
      <path className="mark-bar" d="M50 88 L74 88 L70 100 L46 100 Z" />
      <circle className="mark-dot" cx="128" cy="106" r="8" />
    </svg>
  )
}
