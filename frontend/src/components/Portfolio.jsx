import Reveal from './Reveal'

export default function Portfolio() {
  const brands = [
    { name: 'Pooja Dining', desc: 'Restaurant & dining brand — social media, reels and menu promotions that bring more covers through the door.' },
    { name: 'Shree Shyam Gulacha Chaha', desc: 'Local chai brand — identity, packaging and social reach that turned a corner stall into a community favourite.' },
    { name: 'Creative Enterprises', desc: 'Wholesale decorators for events — branding and digital presence built to look credible and win bookings.' },
    { name: 'Jay Jagganath Hospital', desc: 'Healthcare brand — awareness campaigns and reputation building that earn patient trust.' },
    { name: 'Mangal Alankar', desc: 'Jewellery brand — cinematic product videos and festive campaigns that drive footfall.' },
    { name: 'SD Cabinets', desc: 'Cabinet manufacturers — product shoots and promotions that showcase precision craftsmanship and drive enquiries.' },
    { name: 'Sai Mobiles Gallery', desc: 'Retail mobile store — offers, reels and local ads that fill the sales floor.' },
    { name: 'Denzfox', desc: 'Clothing store — fashion shoots, reels and seasonal campaigns that drive footfall and online sales.' },
    { name: 'Radhika Dining', desc: 'Veg & non-veg restaurant — menu promotions, reels and local ads that fill the tables.' },
  ]

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
                key={b.name}
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
                <p className="text-sm leading-relaxed text-slate-500">{b.desc}</p>
              </div>
            ))}
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
