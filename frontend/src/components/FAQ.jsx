import { useState } from 'react'

export default function FAQ({ items }) {
  const list = Array.isArray(items) ? items : []
  const [openIdx, setOpenIdx] = useState(null)

  const defaultFAQ = [
    { q: 'What makes Promotix different from other agencies?', a: 'We combine premium creative production with data-driven strategy.' },
    { q: 'How long does it take to see results?', a: 'Most clients see improvements in brand visibility within 30-60 days.' },
    { q: 'Do you work with businesses outside Nipani/Belagavi?', a: 'Absolutely! We work with clients across India, managed remotely.' },
  ]

  const faqs = list.length > 0 ? list : defaultFAQ

  return (
    <section id="faq" className="py-20 px-[5%] bg-gradient-to-b from-transparent via-violet/5 to-transparent">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="tag">FAQ</span>
          <h2 className="sh mt-4">Frequently Asked <span className="gt">Questions</span></h2>
        </div>
        <div className="max-w-[760px] mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-black/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className={`w-full flex justify-between items-center px-6 py-4 text-sm font-semibold text-left transition-colors ${
                  openIdx === i ? 'bg-violet/10 text-violet-light' : 'hover:bg-black/[0.025]'
                }`}
              >
                {faq.q}
                <span className={`w-6 h-6 rounded-full border border-black/20 flex items-center justify-center flex-shrink-0 text-sm transition-all ${
                  openIdx === i ? 'border-violet bg-violet/20 rotate-45' : ''
                }`}>+</span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIdx === i ? 'max-h-72' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-slate leading-relaxed text-sm">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
