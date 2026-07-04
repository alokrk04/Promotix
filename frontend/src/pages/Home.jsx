import { useState, useEffect } from 'react'
import { api } from '../api/client'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import About from '../components/About'
import Portfolio from '../components/Portfolio'
import Process from '../components/Process'
import Testimonials from '../components/Testimonials'
import Pricing from '../components/Pricing'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getWebsite()
      .then(setData)
      .catch(() => setLoading(false))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-[#F8F9FA] z-50">
        <div className="flex items-center gap-3">
          <div className="text-4xl font-extrabold tracking-widest gt">PROMOTIX</div>
        </div>
        <div className="w-44 h-0.5 bg-black/10 rounded overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-violet to-cyan rounded animate-pulse" />
        </div>
      </div>
    )
  }

  const getSection = (key) => data?.sections?.find((s) => s.key === key)
  const getServices = (section) => data?.services?.filter((s) => s.section === section) || []
  const hero = getSection('hero')
  const about = getSection('about')
  const services = getSection('services')
  const process = getSection('process')
  const faq = getSection('faq')
  const contact = getSection('contact')
  const stats = getSection('stats')
  const pricing = getSection('pricing')

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {hero?.is_visible && <Hero content={hero.content} stats={stats?.content} />}
        {services?.is_visible && <Services content={services.content} connectServices={getServices('connect')} propertiesServices={getServices('properties')} />}
        {about?.is_visible && <About content={about.content} />}
        {<Portfolio items={data?.portfolio || []} />}
        {process?.is_visible && <Process content={process.content} />}
        {<Testimonials items={data?.testimonials || []} />}
        {pricing?.is_visible && <Pricing content={pricing.content} />}
        {faq?.is_visible && <FAQ items={faq.content} />}
        {contact?.is_visible && <Contact content={contact.content} />}
      </main>
      <Footer />
    </div>
  )
}
