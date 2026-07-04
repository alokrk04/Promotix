import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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

  const links = ['Services', 'About', 'Portfolio', 'Pricing', 'Contact']

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-[5%] py-4 transition-all duration-300 ${
          scrolled ? 'bg-white/85 backdrop-blur-xl border-b border-black/5' : ''
        }`}
      >
        <a href="#" className="flex items-center gap-3 no-underline">
          <span className="text-lg font-extrabold tracking-widest text-black">PROMOTIX</span>
        </a>
        <ul className="hidden md:flex items-center gap-9 list-none">
          {links.map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="text-slate text-sm font-medium no-underline hover:text-black transition-colors">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="hidden md:inline-flex px-6 py-2.5 rounded-full bg-gradient-to-r from-violet to-indigo-600 text-white text-sm font-semibold no-underline shadow-lg shadow-violet/40 hover:-translate-y-0.5 hover:shadow-xl transition-all"
        >
          Start Project →
        </a>
        <button
          className="md:hidden flex flex-col gap-1 z-50 bg-transparent border-none cursor-pointer p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-frost rounded transition-all ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`block w-5 h-0.5 bg-frost rounded transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-frost rounded transition-all ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </nav>
      <div
        className={`fixed inset-0 bg-white/98 z-40 flex flex-col items-center justify-center gap-10 transition-transform duration-500 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {links.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            onClick={() => setOpen(false)}
            className="text-frost text-2xl font-bold no-underline"
          >
            {l}
          </a>
        ))}
      </div>
    </>
  )
}
