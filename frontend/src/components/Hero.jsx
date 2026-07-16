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
    <section id="hero" className="min-h-screen flex items-center py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute w-[700px] h-[700px] rounded-full bg-gradient-to-br from-violet/5 to-transparent top-[-250px] right-[-150px] pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-br from-cyan/5 to-transparent bottom-[-100px] left-[-80px] pointer-events-none" />
      <div className="w-full max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-[clamp(2.4rem,6vw,5.2rem)] sm:text-[clamp(2.8rem,6.5vw,5.5rem)] font-extrabold leading-[1.04] tracking-tight mb-5">
          <span className="gt">{c.line1 || 'We Turn Ideas Into Impact.'}</span>
        </h1>
        <p className="text-base sm:text-lg text-slate leading-relaxed max-w-[580px] mx-auto mb-8 sm:mb-10 px-2 sm:px-0">
          {c.subtitle || 'From cinematic marketing to premium property solutions.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 flex-wrap">
          <a href="#pricing" className="btn-p w-full sm:w-auto">Start Your Package →</a>
          <a href="https://forms.gle/pKp5jPdLpNHV17Ps5" target="_blank" className="btn-p w-full sm:w-auto" style={{background:'linear-gradient(135deg,#7C3AED,#4F46E5)'}}>Connect With Promotix</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-10 mt-12 sm:mt-14 pt-8 sm:pt-10 border-t border-black/5">
          {statsArr.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold gt">{stat.value}</div>
              <div className="text-[11px] sm:text-xs text-slate mt-1 leading-relaxed">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
