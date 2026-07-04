const icons = ['🎨', '📱', '📈', '🎬']
const colors = ['rgba(124,58,237,.15)', 'rgba(6,182,212,.15)', 'rgba(236,72,153,.15)', 'rgba(6,182,212,.15)']

function ServiceCard({ name, desc, icon, color, featured }) {
  if (featured) {
    return (
      <div className="col-span-full max-w-[500px] mx-auto w-full text-center gcard p-8" style={{ background: 'linear-gradient(135deg,rgba(124,58,237,.08),rgba(6,182,212,.06))', borderColor: 'rgba(124,58,237,.3)' }}>
        <div className="w-13 h-13 rounded-xl flex items-center justify-center text-2xl mx-auto mb-5" style={{ background: 'rgba(236,72,153,.15)' }}>🎥</div>
        <div className="font-bold text-base mb-2">{name}</div>
        <div className="text-slate text-sm leading-relaxed">{desc}</div>
      </div>
    )
  }
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

export default function Services({ content, connectServices, propertiesServices }) {
  const c = content || {}
  const connect = c.connect?.items || connectServices
  const properties = c.properties?.items || propertiesServices

  return (
    <section id="services" className="py-20 px-[5%] bg-gradient-to-b from-transparent via-violet/5 to-transparent">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="tag">Our Capabilities</span>
          <h2 className="sh mt-4">Two Brands, <span className="gt">One Promise</span></h2>
          <p className="ss mx-auto">{c.subtitle || 'Two specialized divisions under one roof.'}</p>
        </div>
        <div className="mb-10">
          <p className="text-center font-semibold mb-5"><span className="mr-1">🚀</span> Promotix Connect — Marketing Agency</p>
          <div className="grid grid-cols-2 gap-4 max-w-[640px] mx-auto">
            {connect?.slice(0, 4).map((svc, i) => (
              <ServiceCard key={i} name={svc.name} desc={svc.desc} icon={icons[i] || '🎨'} color={colors[i] || 'rgba(124,58,237,.15)'} />
            ))}
          </div>
          {connect?.length > 4 && (
            <ServiceCard featured name={connect[4].name} desc={connect[4].desc} />
          )}
        </div>
        <div>
          <p className="text-center font-semibold mb-5"><span className="mr-1">🏡</span> Promotix Properties — Real Estate Solutions</p>
          <div className="grid grid-cols-2 gap-4 max-w-[640px] mx-auto">
            {properties?.map((svc, i) => (
              <ServiceCard key={i} name={svc.name} desc={svc.desc} icon={['🏠', '📷', '🔑', '🏗️'][i] || '🏠'} color={['rgba(52,211,153,.15)', 'rgba(251,191,36,.15)', 'rgba(124,58,237,.15)', 'rgba(6,182,212,.15)'][i] || 'rgba(52,211,153,.15)'} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
