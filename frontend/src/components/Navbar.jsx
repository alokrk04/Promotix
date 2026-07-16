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
            <span className="text-lg font-extrabold tracking-widest text-black">PROMOTIX</span>
            <span className="hidden sm:inline text-[10px] font-medium text-slate tracking-wider uppercase border-l border-black/15 pl-3 leading-none">connect with customers</span>
          </a>
        </div>
      </nav>
    </>
  )
}
