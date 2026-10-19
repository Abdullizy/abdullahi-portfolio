// ============================================================
//  EDIT YOUR CONTENT HERE. Everything on the site comes from
//  this file, so you rarely need to touch the other files.
// ============================================================

export const profile = {
  name: 'Abdullahi',
  role: 'Frontend developer',
  city: 'YOUR CITY',
  email: 'your@email.com', // used by the contact form and the Email button
  whatsapp: '2340000000000', // country code + number, no + or spaces
  replyTime: '24 hours',
  // Optional: paste a free Formspree form link (https://formspree.io) so the contact
  // form sends straight to your inbox. Leave empty to open the visitor's email app.
  formEndpoint: '',
  headline:
    'A frontend developer who builds fast, mobile-friendly websites that make your business look as good as it is.',
  about1:
    'I use HTML, CSS, JavaScript and React, together with modern tools, to build websites quickly without cutting corners on design.',
  about2: 'ONE SENTENCE ABOUT WHAT MAKES YOU DIFFERENT',
  photo: '', // e.g. '/me.png' after you put me.png inside the public folder
  socials: {
    github: '#',
    linkedin: '#',
    x: '#',
    instagram: '#',
  },
}

export const settings = {
  accent: 'violet' as 'violet' | 'lime',
  defaultTheme: 'dark' as 'dark' | 'light',
  // true  = the intro (animated A) plays on EVERY page load and reload
  // false = it plays only the first time someone opens the site in a tab
  introEveryLoad: true,
}

export const banner = {
  // Set showStats to true ONLY when you have real numbers to show
  showStats: false,
  statsTitle: 'Trusted by clients',
  text: "Helping businesses stand out online. Together we'll build a website people remember. No fuss, always clear.",
  side: 'The mix of design, code and clear communication makes your project easier, and your website better.',
  stats: [
    { num: '0+', label: 'Projects delivered' },
    { num: '0+', label: 'Happy clients' },
    { num: '0', label: 'Years of experience' },
  ],
}

export const marquee = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Next.js',
  'Tailwind CSS',
  'Responsive design',
  'Fast performance',
  'Clean code',
]

export const services = [
  {
    title: 'Business websites',
    text: 'A professional home on the web: your services, your story and a clear way for customers to reach you.',
    goodFor: 'shops, agencies, clinics, schools',
    icon: 'M3 5h18v14H3zM3 9h18',
    wide: true,
  },
  {
    title: 'Landing pages',
    text: 'One focused page built to turn visitors into enquiries, sign-ups or sales.',
    goodFor: 'launches, ads, events',
    icon: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
    wide: false,
  },
  {
    title: 'Portfolio sites',
    text: 'A personal site that shows your work and helps you win clients or jobs.',
    goodFor: 'creatives, freelancers',
    icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    wide: false,
  },
  {
    title: 'Redesign and speed-up',
    text: 'A tired or slow site rebuilt to look current, load quickly and work well on phones.',
    goodFor: 'outdated or slow websites',
    icon: 'M21 12a9 9 0 1 1-3-6.7M21 4v5h-5',
    wide: true,
  },
]

export const focusChips = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Responsive design',
  'Clean code',
  'AI-assisted',
  'Fast loading',
]

export type Project = {
  name: string
  description: string
  live: string
  source: string
  image: string // e.g. '/projects/shop.png' (file inside the public folder)
}

// Add as many projects as you like. The shapes repeat every four cards.
export const projects: Project[] = [
  { name: 'Project 1', description: 'Two sentences about what this project is and who it is for.', live: '', source: '', image: '' },
  { name: 'Project 2', description: 'Two sentences about what this project is and who it is for.', live: '', source: '', image: '' },
  { name: 'Project 3', description: 'Two sentences about what this project is and who it is for.', live: '', source: '', image: '' },
  { name: 'Project 4', description: 'Two sentences about what this project is and who it is for.', live: '', source: '', image: '' },
]

export const steps = [
  { num: '01', title: 'Brief', text: 'We talk through your goals, your audience and what you need on the site.' },
  { num: '02', title: 'Design', text: 'You see the layout first and give feedback before any code is written.' },
  { num: '03', title: 'Build', text: 'I build the site and share progress so you can see it take shape.' },
  { num: '04', title: 'Launch', text: 'We test everything, go live, and I stay available for fixes.' },
]

export type Testimonial = { quote: string; who: string; role: string }

// Only add REAL testimonials from real people. Set to [] to hide the whole section.
export const testimonials: Testimonial[] = [
  { quote: 'Replace with a real quote from a real client.', who: 'Client name', role: 'Role, Company' },
  { quote: 'Replace with a real quote from a real client.', who: 'Client name', role: 'Role, Company' },
  { quote: 'Replace with a real quote from a real client.', who: 'Client name', role: 'Role, Company' },
  { quote: 'Replace with a real quote from a real client.', who: 'Client name', role: 'Role, Company' },
  { quote: 'Replace with a real quote from a real client.', who: 'Client name', role: 'Role, Company' },
]

export const statement = ['Great', 'websites', 'are', 'built', 'one', 'detail', 'at', 'a', 'time.']
