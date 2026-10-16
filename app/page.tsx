import Loader from '@/components/site/loader'
import Header from '@/components/site/header'
import Hero from '@/components/site/hero'
import Banner from '@/components/site/banner'
import { Marquee, Services, Focus, Process, About, Statement } from '@/components/site/sections'
import Projects from '@/components/site/projects'
import Testimonials from '@/components/site/testimonials'
import Contact from '@/components/site/contact'
import Footer from '@/components/site/footer'
import ShatterBg from '@/components/site/shatter-bg'

export default function Home() {
  return (
    <>
      <ShatterBg />
      <Loader />
      <Header />
      <main>
        <Hero />
        <Banner />
        <Marquee />
        <Services />
        <Focus />
        <Projects />
        <Process />
        <About />
        <Statement />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
