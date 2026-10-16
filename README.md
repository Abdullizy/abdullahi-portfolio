# Abdullahi - Portfolio (Next.js + TypeScript + Tailwind v4 + shadcn/ui)

## Run it on your PC
Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Edit your content
Everything lives in `lib/data.ts`:
- `profile`: name, email, WhatsApp number (digits only, with country code), photo, socials, `formEndpoint`
- `settings.accent`: `'violet'` or `'lime'`; `settings.defaultTheme`: `'dark'` or `'light'`
- `projects`: title, description, link, image. Put images in `public/` and reference them as `/my-image.png`
- `testimonials`: replace the placeholders with real ones, or set the array to `[]` to hide the section
- `banner.showStats`: set to `true` to show the stats row once you have real numbers

## Contact form
Create a free form at https://formspree.io, then paste its URL into `profile.formEndpoint`.
Until then the form opens the visitor's email app instead.

## Add more shadcn/ui components
`npx shadcn@latest add <component>` (config is in `components.json`).

## Deploy
Push to GitHub and import the repo on https://vercel.com (zero config).

Note: the scroll-driven banner animation works in current Chrome/Edge; other browsers show a plain banner.
