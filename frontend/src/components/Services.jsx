function ServiceCard({ name, desc, icon, color }) {
  return (
    <div className="gcard p-8 text-center cursor-default transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(124,58,237,0.12)] group">
      <div className="w-13 h-13 rounded-xl flex items-center justify-center text-2xl mx-auto mb-5" style={{ background: color || 'rgba(124,58,237,.15)' }}>
        {icon}
      </div>
      <div className="font-bold text-base mb-2">{name}</div>
      <div className="text-slate text-sm leading-relaxed">{desc}</div>
    </div>
  )
}

export default function Services({ content, propertiesServices }) {
  const c = content || {}
  const properties = c.properties?.items || propertiesServices

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-violet/5 to-transparent">
      <div className="section-shell max-w-6xl">
        <div className="text-center mb-12 sm:mb-16">
          <span className="tag">Our Capabilities</span>
          <h2 className="sh mt-4">Promotix Properties — Real Estate Solutions</h2>
          <p className="ss mx-auto">{c.subtitle || ''}</p>
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[640px] mx-auto">
            {properties?.map((svc, i) => (
              <ServiceCard key={i} name={svc.name} desc={svc.desc} icon={['🏠', '📷', '🔑', '🏗️'][i] || '🏠'} color={['rgba(52,211,153,.15)', 'rgba(251,191,36,.15)', 'rgba(124,58,237,.15)', 'rgba(6,182,212,.15)'][i] || 'rgba(52,211,153,.15)'} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
