const images = ['/resources/Image1.jpg', '/resources/Image2.jpg', '/resources/Image3.jpg', '/resources/Image4.jpg']

export default function Portfolio({ items }) {

  return (
    <section id="portfolio" className="py-20 px-[5%]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="tag">Our Work</span>
          <h2 className="sh mt-4">Projects That <span className="gt">Define Excellence</span></h2>
          <p className="ss mx-auto">A curated showcase of our most impactful work.</p>
        </div>
        <div className="grid grid-cols-2 gap-5 max-w-[680px] mx-auto">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="relative rounded-xl overflow-hidden cursor-pointer h-[280px] border border-black/5 hover:scale-[1.02] hover:shadow-2xl transition-all duration-400"
              style={images[i] ? { backgroundImage: `url(${images[i]})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15 flex flex-col justify-end items-center p-6">
                <span className="px-2 py-0.5 rounded-full bg-violet/35 border border-violet/50 text-xs font-bold tracking-wider uppercase text-white mb-2">
                  {item.category}
                </span>
                <div className="font-bold text-base text-center text-white">{item.title}</div>
                {item.subtitle && <div className="text-white/70 text-xs mt-1 text-center">{item.subtitle}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}