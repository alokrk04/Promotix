import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/85 backdrop-blur-xl border-b border-black/5' : ''
        }`}
      >
        <div className="section-shell flex items-center justify-between py-3 sm:py-4">
          <a href="#" className="flex items-center gap-3 no-underline min-w-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="38" height="38" className="shrink-0">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3322ff" />
                  <stop offset="50%" stopColor="#b81cd4" />
                  <stop offset="100%" stopColor="#ff007a" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="42" fill="none" stroke="url(#logoGrad)" strokeWidth="4.5" />
              <path d="M 33 30 L 33 52 L 25 65 L 39 59 L 31 77 L 47 62 L 72 36 Z" fill="url(#logoGrad)" />
            </svg>
            <span className="text-lg font-extrabold tracking-widest text-black">PROMOTIX</span>
            <span className="hidden sm:inline text-[10px] font-medium text-slate tracking-wider uppercase border-l border-black/15 pl-3 leading-none">connect with customers</span>
          </a>
        </div>
      </nav>
    </>
  )
}
