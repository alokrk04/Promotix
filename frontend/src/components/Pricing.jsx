export default function Pricing({ content }) {
  const c = content || {}
  const premium = c.premium || {}
  const plus = c.premium_plus || {}

  return (
    <section id="pricing" className="py-20 px-[5%] bg-gradient-to-b from-transparent via-cyan/5 to-transparent">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="tag">Pricing Plans</span>
          <h2 className="sh mt-4">Transparent, <span className="gt">Premium Pricing</span></h2>
          <p className="ss mx-auto">Invest in your brand's future. All plans include dedicated support.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-[680px] mx-auto">
          <div className="gcard p-10 flex flex-col">
            <div className="text-base font-semibold text-slate mb-3">{premium.name || 'Premium'}</div>
            <div className="text-4xl font-extrabold mb-1">
              {premium.price || '₹7,499'}<span className="text-sm font-normal text-slate">/mo</span>
            </div>
            <div className="text-slate text-sm mb-7">{premium.period || 'Perfect for growing businesses'}</div>
            <ul className="border-t border-black/5 pt-5 mb-8 flex-1 space-y-3">
              {(premium.features || ['Brand Consultation Session', '8 Social Media Posts/Month', '2 Reels/Month', 'Basic SEO Setup', 'Monthly Performance Report', 'Email Support']).map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-slate text-sm">
                  <span className="text-green">✓</span> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl font-semibold border border-black/15 text-frost hover:border-violet-light hover:bg-violet/10 transition-all mt-auto">
              Get Started
            </button>
          </div>
          <div className="gcard p-10 flex flex-col relative bg-violet/10 border-violet/40 shadow-[0_25px_60px_rgba(124,58,237,0.12)]">
            {plus.badge && (
              <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-violet to-indigo-600 text-xs font-bold tracking-wider text-white whitespace-nowrap">
                {plus.badge}
              </div>
            )}
            <div className="text-base font-semibold text-violet-light mb-3">{plus.name || 'Premium Plus'}</div>
            <div className="text-4xl font-extrabold gt mb-1">
              {plus.price || '₹19,999'}<span className="text-sm font-normal text-slate bg-none" style={{ WebkitTextFillColor: '#64748B', color: '#64748B' }}>/mo</span>
            </div>
            <div className="text-slate text-sm mb-7">{plus.period || 'Perfect for brands ready to scale'}</div>
            <ul className="border-t border-black/5 pt-5 mb-8 flex-1 space-y-3">
              {(plus.features || ['Complete Brand Identity & Guidelines', '15 Social Media Posts/Month', '5 Cinematic Reels/Month', 'Advanced SEO & Content Strategy', 'Meta & Google Ads Management', 'Landing Page Design', 'Weekly Performance Reports', 'WhatsApp Priority Support']).map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-slate text-sm">
                  <span className="text-green">✓</span> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet to-indigo-600 shadow-lg shadow-violet/40 hover:-translate-y-0.5 hover:shadow-xl transition-all">
              Get Started →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
