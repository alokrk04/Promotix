export default function Footer() {
  return (
    <footer className="py-14 px-[5%] border-t border-black/5">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1.1fr] gap-10 mb-12">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <span className="text-lg font-extrabold tracking-widest">PROMOTIX</span>
            </div>
            <p className="text-slate text-sm leading-relaxed max-w-[270px] mx-auto md:mx-0">
              The parent brand behind Promotix Connect (Marketing) and Promotix Properties (Real Estate).
            </p>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold tracking-widest uppercase text-slate mb-5">Services</div>
            <ul className="space-y-2.5 list-none">
              {['Promotix Connect', 'Promotix Properties', 'Branding', 'Social Media', 'Performance Ads'].map((l) => (
                <li key={l}><a href="#" className="text-slate text-sm no-underline hover:text-black transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold tracking-widest uppercase text-slate mb-5">Company</div>
            <ul className="space-y-2.5 list-none">
              {['About', 'Portfolio', 'Process', 'Pricing', 'Contact'].map((l) => (
                <li key={l}><a href={`#${l.toLowerCase()}`} className="text-slate text-sm no-underline hover:text-black transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold tracking-widest uppercase text-slate mb-5">Connect</div>
            <ul className="space-y-2.5 list-none">
              <li><a href="#" className="text-slate text-sm no-underline hover:text-black transition-colors">First Floor, Dumale Building,<br />Ashok Nagar, Nipani, Karnataka 591201</a></li>
              <li><a href="tel:+919380712430" className="text-slate text-sm no-underline hover:text-black transition-colors">+91 93807 12430</a></li>
              <li><a href="https://instagram.com/promotix.official" className="text-slate text-sm no-underline hover:text-black transition-colors">@promotix.official</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center pt-6 border-t border-black/5 text-slate text-xs gap-3">
          <div>© 2026 Promotix. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="/login" className="text-slate no-underline hover:text-black transition-colors">Admin</a>
            <a href="#" className="text-slate no-underline hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate no-underline hover:text-black transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
