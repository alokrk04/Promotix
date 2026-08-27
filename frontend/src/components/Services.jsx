import Reveal from './Reveal'

function ServiceCard({ name, desc, icon, color, horizontal, delay }) {
  const logo = serviceLogos[name]
  const iconEl = logo ? <img src={logo} alt={name} className="w-full h-full object-contain" /> : icon
  return (
    <Reveal delay={delay} from={horizontal ? 'left' : 'up'} className="h-full">
      <div className={`gcard h-full p-8 cursor-default transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(124,58,237,0.12)] group ${horizontal ? 'flex items-center gap-5 text-left max-w-[640px] mx-auto' : 'text-center flex flex-col justify-center'}`}>
        <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-2xl ${horizontal ? 'mb-0' : 'mx-auto mb-5'}`} style={{ background: color || 'rgba(124,58,237,.15)' }}>
          {iconEl}
        </div>
        <div>
          <div className="font-bold text-base mb-2">{name}</div>
          <div className="text-slate text-sm leading-relaxed">{desc}</div>
        </div>
      </div>
    </Reveal>
  )
}

const serviceLogos = {
  'Growth Package': '/resources/growth%20package.png',
  'Social Media Marketing': '/resources/Social%20Media%20Marketing.png',
  'Branding': '/resources/branding.png',
  'Property Listings': '/resources/Property%20Listings%20.png',
  'Real Estate Photography': '/resources/Real%20Estate%20Photography.png',
  'Property Marketing': '/resources/Property%20Marketing.png',
  'Consultation & Staging': '/resources/Consultation%20%26%20Staging.png',
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
        <Reveal>
          <div className="text-center mb-12 sm:mb-16">
            <span className="tag">Our Capabilities</span>
            <h2 className="sh mt-4">{c.connect?.heading || 'Promotix — Marketing Agency'}</h2>
            <p className="ss mx-auto">{c.subtitle || ''}</p>
          </div>
        </Reveal>
        <div className="space-y-12">
          <div className="space-y-6">
            {connect?.length > 0 && (
              <>
                <ServiceCard horizontal name={connect[0].name} desc={connect[0].desc} icon={connectIcons[0]} color={connectColors[0] || 'rgba(124,58,237,.15)'} delay={100} />
                {connect.slice(1).length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[640px] mx-auto">
                    {connect.slice(1).map((svc, i) => (
                      <ServiceCard key={i} name={svc.name} desc={svc.desc} icon={connectIcons[i + 1] || '🎨'} color={connectColors[i + 1] || 'rgba(124,58,237,.15)'} delay={200 + i * 100} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          {properties?.length > 0 && (
            <div>
              <Reveal delay={100}>
                <div className="text-center mb-8">
                  <span className="text-xs font-bold tracking-widest uppercase text-slate/60">{c.properties?.heading || 'Promotix — Marketing Agency'}</span>
                  {c.properties?.subtitle && (
                    <p className="text-sm text-slate mt-2">{c.properties.subtitle}</p>
                  )}
                </div>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[640px] mx-auto">
                {properties?.map((svc, i) => (
                  <ServiceCard key={i} name={svc.name} desc={svc.desc} icon={propertiesIcons[i] || '🏠'} color={propertiesColors[i] || 'rgba(52,211,153,.15)'} delay={150 + i * 100} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
