export default function Testimonials({ items = [] }) {
  const list = items.length >= 2 ? [...items, ...items] : items

  return (
    <section id="testimonials" className="py-20 overflow-hidden">
      <div className="text-center mb-12 px-[5%]">
        <span className="tag">Testimonials</span>
        <h2 className="sh mt-4">What Our <span className="gt">Clients Say</span></h2>
        <p className="ss mx-auto">Real results, real relationships, real impact.</p>
      </div>
      <div className="relative overflow-hidden [mask:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex gap-5 w-max animate-[scroll_35s_linear_infinite] hover:[animation-play-state:paused]">
          {list.map((t, i) => (
            <div key={`${t.id}-${i}`} className="w-[340px] flex-shrink-0 gcard p-7">
              <div className="text-amber-400 text-sm tracking-widest mb-3">
                {'★'.repeat(t.rating || 5)}
              </div>
              <p className="text-slate leading-relaxed text-sm italic mb-5">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet to-indigo-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-slate text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
