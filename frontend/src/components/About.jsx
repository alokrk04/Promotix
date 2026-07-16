import DOMPurify from 'dompurify'

export default function About({ content }) {
  const c = content || {}
  const tagline = c.tagline || 'Connecting Your Business to Better Sales.'
  const paragraph1 = c.paragraph1 || ''
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-cyan/5 to-transparent">
      <div className="section-shell max-w-6xl grid gap-10 lg:grid-cols-2 items-center">
        <div className="text-center lg:text-left">
          <span className="tag">About Promotix</span>
          <h2 className="sh mt-4" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tagline) }} />
          <p className="ss mb-4 lg:text-left" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(paragraph1) }} />
          <p className="ss lg:text-left">{c.paragraph2 || ''}</p>
        </div>
        <div className="relative mx-auto w-full max-w-[480px] aspect-[4/5] sm:h-[480px] h-[360px]">
          <div className="absolute w-[68%] h-[65%] top-0 right-0 rounded-xl bg-gradient-to-br from-violet/20 to-cyan/10 border border-black/5 flex items-center justify-center text-center p-6 animate-[float_4s_ease-in-out_infinite]">
            <div><div className="text-4xl sm:text-5xl mb-3">🚀</div><div className="font-bold text-lg">Promotix </div><div className="text-slate text-sm mt-1">Connect with Customers</div></div>
          </div>
          <div className="absolute w-[44%] h-[44%] bottom-0 left-0 rounded-xl bg-gradient-to-br from-cyan/20 to-violet/10 border border-black/5 flex items-center justify-center text-center p-4 sm:p-6 animate-[float_5.2s_ease-in-out_infinite_1.1s]">
            <div><div className="text-3xl sm:text-4xl mb-2">🏡</div><div className="font-semibold text-sm sm:text-base">Promotix Properties</div></div>
          </div>
        </div>
      </div>
    </section>
  )
}
