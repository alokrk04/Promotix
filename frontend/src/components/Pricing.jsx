function PricingCard({ plan, featured, badge }) {
  const p = plan || {}
  return (
    <div className={`gcard p-6 flex flex-col ${featured ? 'relative bg-violet/10 border-violet/40 shadow-[0_25px_60px_rgba(124,58,237,0.12)]' : ''}`}>
      {badge && (
        <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-violet to-indigo-600 text-xs font-bold tracking-wider text-white whitespace-nowrap">
          {badge}
        </div>
      )}
      <div className={`text-sm font-semibold mb-2 ${featured ? 'text-violet-light' : 'text-slate'}`}>{p.name || 'Plan'}</div>
      <div className={`text-3xl font-extrabold mb-1 ${featured ? 'gt' : ''}`}>
        {p.price || '₹0'}<span className="text-xs font-normal text-slate bg-none" style={featured ? { WebkitTextFillColor: '#64748B', color: '#64748B' } : {}}>/mo</span>
      </div>
      <div className="text-slate text-xs mb-5">{p.period || ''}</div>
      <ul className="border-t border-black/5 pt-4 mb-5 flex-1 space-y-2">
        {(p.features || []).map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-slate text-xs">
            <span className="text-green text-xs">✓</span> {f}
          </li>
        ))}
      </ul>
      {p.sold_out ? (
        <div className="w-full py-2.5 rounded-xl font-semibold text-center bg-gray-200 text-gray-500 cursor-not-allowed text-sm">
          Sold Out
        </div>
      ) : (
        <button className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all mt-auto ${
          featured
            ? 'text-white bg-gradient-to-r from-violet to-indigo-600 shadow-lg shadow-violet/40 hover:-translate-y-0.5 hover:shadow-xl'
            : 'border border-black/15 text-frost hover:border-violet-light hover:bg-violet/10'
        }`}>
          Get Started {featured ? '→' : ''}
        </button>
      )}
    </div>
  )
}

export default function Pricing({ content }) {
  const c = content || {}
  const plans = [
    c.cinematic || {},
    c.branding || {},
    c.premium || {},
    { ...(c.premium_plus || {}), _featured: true },
  ]

  return (
    <section id="pricing" className="py-20 px-[5%] bg-gradient-to-b from-transparent via-cyan/5 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="tag">Pricing Plans</span>
          <h2 className="sh mt-4">Transparent, <span className="gt">Premium Pricing</span></h2>
          <p className="ss mx-auto">Invest in your brand's future. All plans include dedicated support.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6 mx-auto">
          {plans.map((plan, i) => (
            <PricingCard key={i} plan={plan} featured={plan._featured} badge={plan.badge} />
          ))}
        </div>
      </div>
    </section>
  )
}
