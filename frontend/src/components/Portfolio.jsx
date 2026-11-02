import { useEffect, useState } from 'react'

export default function Portfolio() {
  const [brands, setBrands] = useState([])

  useEffect(() => {
    fetch('/api/public/website')
      .then((res) => {
        if (!res.ok) throw new Error('API error')
        return res.json()
      })
      .then((data) => {
        setBrands(data.brands || [])
      })
      .catch((err) => {
        console.error('Failed to fetch brands:', err)
      })
  }, [])

  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="section-shell max-w-6xl">
        <Reveal>
          <div className="text-center mb-12">
            <span className="tag">Our Work</span>
            <h2 className="sh mt-4">Brands We <span className="gt">Work With</span></h2>
            <p className="ss mx-auto">A curated showcase of the brands we've partnered with.</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {brands.map((b, i) => (
              <div
                key={b.id || i}
                className="group gcard p-5 sm:p-6 flex flex-col gap-3 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-violet to-indigo-600 text-white text-sm font-bold shadow-sm shadow-violet/30">
                    {i + 1}
                  </span>
                  <h3 className="font-display font-bold text-xl leading-snug tracking-tight text-slate-800 group-hover:text-violet transition-colors duration-300">
                    {b.name}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-500">{b.description || ''}</p>
              </div>
            ))}
            {brands.length === 0 && (
              <p className="col-span-full text-center text-slate-500">No brands added yet. Add some from the admin dashboard.</p>
            )}
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-12 text-center">
            <a href="#contact" className="btn-s">Want your brand featured here? <span className="gt">Let's Talk</span></a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
