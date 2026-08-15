import { useRef, useState } from 'react'
import Reveal from './Reveal'

const categoryStyle = {
  social: { gradient: 'linear-gradient(135deg,#7C3AED 0%,#0EA5E9 100%)', icon: '📈', chip: 'bg-cyan/20 border-cyan/50 text-cyan-200' },
  video: { gradient: 'linear-gradient(135deg,#0EA5E9 0%,#EC4899 100%)', icon: '🎬', chip: 'bg-pink/20 border-pink/50 text-pink-200' },
  branding: { gradient: 'linear-gradient(135deg,#F59E0B 0%,#EF4444 100%)', icon: '🎨', chip: 'bg-amber/20 border-amber/50 text-amber-200' },
  default: { gradient: 'linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%)', icon: '🚀', chip: 'bg-violet/35 border-violet/50 text-white' },
}

const palette = [
  'linear-gradient(135deg,#7C3AED 0%,#0EA5E9 100%)',
  'linear-gradient(135deg,#0EA5E9 0%,#EC4899 100%)',
  'linear-gradient(135deg,#F59E0B 0%,#EF4444 100%)',
  'linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%)',
  'linear-gradient(135deg,#10B981 0%,#0EA5E9 100%)',
]

function DepthLayer({ mx, my, className, children }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className || ''}`}
      style={{ transform: `translate3d(calc(var(--mx, 0) * ${mx}px), calc(var(--my, 0) * ${my}px), 0)` }}
    >
      {children}
    </div>
  )
}

function Float({ duration = '5s', delay = '0s', className, children }) {
  return (
    <div data-float className={className} style={{ animation: `float3d ${duration} ease-in-out infinite ${delay}` }}>
      {children}
    </div>
  )
}

function PortfolioCard({ item, index, big }) {
  const cardRef = useRef(null)
  const [hovering, setHovering] = useState(false)

  const handleMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--mx', x.toFixed(3))
    el.style.setProperty('--my', y.toFixed(3))
    el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`)
  }

  const style = categoryStyle[item.category] || categoryStyle.default
  const gradient = item.gradient || palette[index % palette.length]
  const icon = item.emoji || style.icon

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer border border-black/5 hover:shadow-[0_30px_60px_rgba(0,0,0,0.35)] ${
        big ? 'h-[320px] sm:h-[400px]' : 'h-[270px] sm:h-[320px]'
      }`}
      style={{
        background: gradient,
        transform: `perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))${hovering ? ' translateY(-6px) scale(1.015)' : ''}`,
        transition: hovering ? 'transform 0.12s ease-out' : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(circle at calc(50% + var(--mx, 0) * 45%) calc(50% + var(--my, 0) * 45%), rgba(255,255,255,0.22), transparent 55%)' }}
      />
      <DepthLayer mx={14} my={14}>
        <Float duration="6s" className="absolute w-[140px] h-[140px] rounded-full bg-white/15 blur-2xl top-[-20px] right-[-10px]" />
        <Float duration="7s" delay="0.8s" className="absolute w-[90px] h-[90px] rounded-full border border-white/25 top-[30%] left-[8%]" />
        <Float duration="5s" delay="0.4s" className="absolute w-[50px] h-[50px] rounded-full bg-white/10 bottom-[18%] right-[12%]" />
        <Float duration="4s" delay="1.2s" className="absolute w-3 h-3 rounded-full bg-white/40 top-[22%] right-[20%]" />
        <Float duration="8s" delay="1.6s" className="absolute w-2 h-2 rounded-full bg-white/30 bottom-[38%] left-[22%]" />
      </DepthLayer>
      <DepthLayer mx={-22} my={-22}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Float duration="5.5s" delay="0.6s">
            <div
              className={`leading-none opacity-10 select-none transition-[scale,rotate] duration-500 group-hover:[scale:1.12] group-hover:[rotate:-8deg] ${
                big ? 'text-[220px] sm:text-[280px]' : 'text-[150px]'
              }`}
            >
              {icon}
            </div>
          </Float>
        </div>
      </DepthLayer>
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 sm:p-6"
        style={{ transform: 'translate3d(calc(var(--mx, 0) * 8px), calc(var(--my, 0) * 8px), 0)' }}
      >
        <span className={`self-start px-2.5 py-1 rounded-full border text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-2.5 ${style.chip}`}>
          {item.category}
        </span>
        <div className={`text-white font-bold leading-snug ${big ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>{item.title}</div>
        {item.subtitle && (
          <div className={`text-white/70 mt-1 flex items-center gap-1.5 ${big ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
            {item.subtitle}
          </div>
        )}
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/0 transition-all duration-300 group-hover:text-white/90">
          <span className="inline-flex items-center gap-1.5 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            View Project <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Portfolio({ items }) {
  const list = Array.isArray(items) ? items : []
  const [featured, ...rest] = list

  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="section-shell max-w-6xl">
        <Reveal>
          <div className="text-center mb-12">
            <span className="tag">Our Work</span>
            <h2 className="sh mt-4">Brands We <span className="gt">Work With</span></h2>
            <p className="ss mx-auto">A curated showcase of our most impactful work.</p>
          </div>
        </Reveal>
        <div className="max-w-[680px] mx-auto space-y-5">
          {featured && (
            <Reveal>
              <PortfolioCard item={featured} index={0} big />
            </Reveal>
          )}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {rest.map((item, i) => (
                <Reveal key={item.id || i} delay={100 + i * 90}>
                  <PortfolioCard item={item} index={i + 1} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
        <Reveal delay={200}>
          <div className="mt-12 text-center">
            <a href="#contact" className="btn-s">Want your brand featured here? <span className="gt">Let's Talk</span></a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
