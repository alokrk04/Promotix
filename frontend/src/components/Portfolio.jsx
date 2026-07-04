import { useState } from 'react'

const gradients = [
  'from-violet/30 to-cyan/20',
  'from-magenta/20 to-violet/30',
  'from-cyan/20 to-green/20',
  'from-yellow-400/20 to-magenta/20',
  'from-green/20 to-cyan/20',
  'from-violet/20 to-magenta/20',
]

export default function Portfolio({ items }) {
  const [filter, setFilter] = useState('all')

  const categories = ['all', 'branding', 'social', 'video']
  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter)

  return (
    <section id="portfolio" className="py-20 px-[5%]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="tag">Our Work</span>
          <h2 className="sh mt-4">Projects That <span className="gt">Define Excellence</span></h2>
          <p className="ss mx-auto">A curated showcase of our most impactful work.</p>
        </div>
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                filter === cat ? 'bg-violet/15 border-violet/40 text-violet-light' : 'border-black/10 text-slate hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-5 max-w-[680px] mx-auto">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className={`relative rounded-xl overflow-hidden cursor-pointer bg-gradient-to-br h-[280px] ${
                gradients[i % gradients.length]
              } border border-black/5 hover:scale-[1.02] hover:shadow-2xl transition-all duration-400`}
            >
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <span className="text-5xl">{item.emoji || '📁'}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-transparent flex flex-col justify-end items-center p-6 opacity-0 hover:opacity-100 transition-all duration-400 translate-y-3 hover:translate-y-0">
                <span className="px-2 py-0.5 rounded-full bg-violet/15 border border-violet/30 text-xs font-bold tracking-wider uppercase text-violet-light mb-2">
                  {item.category}
                </span>
                <div className="font-bold text-base text-center">{item.title}</div>
                {item.subtitle && <div className="text-slate text-xs mt-1 text-center">{item.subtitle}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
