export default function Hero({ content, stats }) {
  const c = content || {}
  const s = stats || {}
  const statsArr = [
    { value: s.brands?.value || '150+', label: s.brands?.label || 'Brands & Properties' },
    { value: s.followers?.value || '12.1K', label: s.followers?.label || 'Instagram Followers' },
    { value: s.years?.value || '3+', label: s.years?.label || 'Years of Excellence' },
    { value: s.satisfaction?.value || '98%', label: s.satisfaction?.label || 'Client Satisfaction' },
  ]

  return (
    <section id="hero" className="min-h-screen flex items-center px-[5%] relative">
      <div className="absolute w-[700px] h-[700px] rounded-full bg-gradient-to-br from-violet/5 to-transparent top-[-250px] right-[-150px] pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-br from-cyan/5 to-transparent bottom-[-100px] left-[-80px] pointer-events-none" />
      <div className="max-w-[800px] mx-auto text-center relative z-10">
        <h1 className="text-[clamp(2.8rem,6.5vw,5.5rem)] font-extrabold leading-[1.04] tracking-tight mb-5">
          <span className="gt">{c.line1 || 'We Turn Ideas Into Impact.'}</span>
        </h1>
        <p className="text-lg text-slate leading-relaxed max-w-[580px] mx-auto mb-10">
          {c.subtitle || 'From cinematic marketing to premium property solutions.'}
        </p>
        <div className="flex items-center justify-center gap-5 flex-wrap">
          <a href="#contact" className="btn-p">Start Your Package →</a>
          <a href="https://forms.gle/pKp5jPdLpNHV17Ps5" target="_blank" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-semibold no-underline transition-all duration-300 hover:-translate-y-1" style={{background:'linear-gradient(135deg,#7C3AED,#4F46E5)'}}>Connect With Promotix</a>
        </div>
        <div className="flex items-center justify-center gap-10 mt-14 pt-10 border-t border-black/5 flex-wrap">
          {statsArr.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-extrabold gt">{stat.value}</div>
              <div className="text-xs text-slate mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
