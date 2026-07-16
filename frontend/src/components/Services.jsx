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

const connectIcons = ['🎨', '📱', '📈', '🎬']
const connectColors = ['rgba(124,58,237,.15)', 'rgba(6,182,212,.15)', 'rgba(236,72,153,.15)', 'rgba(6,182,212,.15)']
const propertiesIcons = ['🏠', '📷', '🔑', '🏗️']
const propertiesColors = ['rgba(52,211,153,.15)', 'rgba(251,191,36,.15)', 'rgba(124,58,237,.15)', 'rgba(6,182,212,.15)']

export default function Services({ content, connectServices, propertiesServices }) {
  const c = content || {}
  const connect = c.connect?.items || connectServices
  const properties = c.properties?.items || propertiesServices

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-violet/5 to-transparent">
      <div className="section-shell max-w-6xl">
        <div className="text-center mb-12 sm:mb-16">
          <span className="tag">Our Capabilities</span>
          <h2 className="sh mt-4">{c.connect?.heading || 'Promotix Connect — Marketing Agency'}</h2>
          <p className="ss mx-auto">{c.subtitle || ''}</p>
        </div>
        <div className="space-y-12">
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[640px] mx-auto">
              {connect?.map((svc, i) => (
                <ServiceCard key={i} name={svc.name} desc={svc.desc} icon={connectIcons[i] || '🎨'} color={connectColors[i] || 'rgba(124,58,237,.15)'} />
              ))}
            </div>
          </div>
          {properties?.length > 0 && (
            <div>
              <div className="text-center mb-8">
                <span className="text-xs font-bold tracking-widest uppercase text-slate/60">{c.properties?.heading || 'Promotix — Marketing Agency'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[640px] mx-auto">
                {properties?.map((svc, i) => (
                  <ServiceCard key={i} name={svc.name} desc={svc.desc} icon={propertiesIcons[i] || '🏠'} color={propertiesColors[i] || 'rgba(52,211,153,.15)'} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
