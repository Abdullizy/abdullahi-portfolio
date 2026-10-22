import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import '@fontsource/instrument-serif/400-italic.css'
import './globals.css'
import { profile, settings } from '@/lib/data'
import MotionProvider from '@/components/site/motion-provider'

export const metadata: Metadata = {
  title: `${profile.name} | ${profile.role}`,
  description: `${profile.name} builds fast, mobile-friendly websites for businesses and founders.`,
  openGraph: {
    title: `${profile.name} | ${profile.role}`,
    description: 'Fast, mobile-friendly websites for businesses and founders.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0B0A10',
  width: 'device-width',
  initialScale: 1,
}

// Runs before first paint: restores the saved theme, sets the accent, and
// skips the intro animation if it was already seen in this browser session.
const bootScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var t=null;try{t=localStorage.getItem('theme')}catch(e){}
d.setAttribute('data-theme',t||${JSON.stringify(settings.defaultTheme)});d.setAttribute('data-accent',${JSON.stringify(settings.accent)});
try{if(sessionStorage.getItem('intro-seen')==='1'){d.setAttribute('data-intro','off')}}catch(e){}}catch(e){}})();`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme={settings.defaultTheme}
      data-accent={settings.accent}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
