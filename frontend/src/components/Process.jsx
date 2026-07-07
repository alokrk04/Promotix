const defaultSteps = [
  { num: '01', name: 'Discover', desc: 'Deep-dive into your brand, audience, and competitive landscape to uncover hidden opportunities.' },
  { num: '02', name: 'Strategy', desc: 'Craft a comprehensive roadmap with clear goals, messaging frameworks, and measurable KPIs.' },
  { num: '03', name: 'Design', desc: 'Create stunning visuals, brand assets, and creative concepts that capture your brand essence.' },
  { num: '04', name: 'Development', desc: 'Build and implement everything — from websites to full campaign assets — with precision.' },
  { num: '05', name: 'Launch & Market', desc: 'Amplify across channels to maximize reach, engagement, and conversions.' },
  { num: '06', name: 'Scale & Grow', desc: 'Continuous analysis, iteration, and intelligent scaling for sustainable growth.' },
]

const stepColors = [
  'from-violet/20 to-violet/5 border-violet/60 text-violet-400',
  'from-cyan/20 to-cyan/5 border-cyan/60 text-cyan-300',
  'from-magenta/20 to-magenta/5 border-magenta/60 text-pink-300',
  'from-yellow-400/20 to-yellow-400/5 border-yellow-400/60 text-yellow-300',
  'from-green/20 to-green/5 border-green/60 text-green-300',
  'from-violet/20 to-violet/5 border-violet/60 text-violet-400',
]

export default function Process({ content }) {
  const c = content || {}
  const items = c.steps || defaultSteps

  return (
    <section id="process" className="py-20 px-[5%] bg-gradient-to-b from-transparent via-violet/5 to-transparent">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="tag">How We Work</span>
          <h2 className="sh mt-4">Our <span className="gt">6-Step Process</span></h2>
          <p className="ss mx-auto">{c.subtitle || 'A proven framework.'}</p>
        </div>
        <div className="relative max-w-[820px] mx-auto">
          <div className="absolute left-10 top-3 bottom-3 w-px bg-gradient-to-b from-transparent via-violet/50 to-transparent hidden md:block" />
          {items.map((step, i) => (
            <div key={i} className="flex gap-8 items-start pb-11 last:pb-0">
              <div className={`w-20 h-20 min-w-[80px] rounded-full flex items-center justify-center text-lg font-extrabold border-2 relative z-10 bg-gradient-to-br ${stepColors[i % stepColors.length]}`}>
                {step.num || String(i + 1).padStart(2, '0')}
              </div>
              <div className="pt-3">
                <div className="text-xl font-bold mb-2">{step.name}</div>
                <div className="text-slate leading-relaxed text-sm">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
