import { useState } from 'react'
import { api } from '../lib/client'

export default function Contact({ content }) {
  const c = content || {}
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', message: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await api.submitContact(form)
      setStatus('ok')
      setForm({ name: '', email: '', company: '', service: '', message: '' })
      setTimeout(() => setStatus(''), 3500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus(''), 3500)
    }
  }

  const contactInfo = [
    { icon: '📍', label: 'Location', value: c.location || 'Nipani, Karnataka, India' },
    { icon: '📱', label: 'Phone', value: c.phone || '+91 93807 12430' },
    { icon: '✉️', label: 'Email', value: c.email || 'Promotix.officiall@gmail.com' },
    { icon: '⏰', label: 'Hours', value: c.hours || 'Mon–Sat, 9 AM – 7 PM IST' },
    { icon: '📸', label: 'Instagram', value: c.instagram || '@promotix.official' },
  ]

  return (
    <section id="contact" className="py-20 px-[5%] bg-gradient-to-b from-transparent via-cyan/5 to-transparent">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="tag">Get In Touch</span>
          <h2 className="sh mt-4">Let's Build Something <span className="gt">Extraordinary</span></h2>
          <p className="ss mx-auto">We respond within 24 hours.</p>
        </div>
        <div className="grid md:grid-cols-[1fr_1.25fr] gap-12">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-7">Contact Information</h3>
            <div className="inline-block text-left space-y-5">
              {contactInfo.map((info, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center text-lg flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{info.label}</div>
                    <div className="text-slate text-sm">{info.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="gcard p-9">
            <h3 className="font-bold text-lg mb-5">Send Us a Message</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                className="w-full px-4 py-3 bg-black/[0.03] border border-black/10 rounded-xl outline-none focus:border-violet focus:bg-violet/5 text-sm transition-all"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                required
              />
              <input
                className="w-full px-4 py-3 bg-black/[0.03] border border-black/10 rounded-xl outline-none focus:border-violet focus:bg-violet/5 text-sm transition-all"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                required
              />
            </div>
            <input
              className="w-full px-4 py-3 bg-black/[0.03] border border-black/10 rounded-xl outline-none focus:border-violet focus:bg-violet/5 text-sm transition-all mb-4"
              placeholder="Company / Brand Name"
              value={form.company}
              onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
            />
            <select
              className="w-full px-4 py-3 bg-black/[0.03] border border-black/10 rounded-xl outline-none focus:border-violet focus:bg-violet/5 text-sm transition-all mb-4 appearance-none cursor-pointer"
              value={form.service}
              onChange={(e) => setForm((s) => ({ ...s, service: e.target.value }))}
            >
              <option value="">Service Interested In</option>
              <option>Branding</option>
              <option>Social Media Marketing</option>
              <option>Performance Marketing</option>
              <option>Content Creation</option>
              <option>Promotix Properties</option>
              <option>Full-Service Package</option>
            </select>
            <textarea
              className="w-full px-4 py-3 bg-black/[0.03] border border-black/10 rounded-xl outline-none focus:border-violet focus:bg-violet/5 text-sm transition-all mb-4 min-h-[110px] resize-y"
              placeholder="Tell us about your project..."
              value={form.message}
              onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
              required
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className={`w-full py-4 rounded-xl text-white font-semibold transition-all shadow-lg ${
                status === 'ok'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500'
                  : status === 'error'
                  ? 'bg-gradient-to-r from-red-600 to-red-500'
                  : 'bg-gradient-to-r from-violet to-indigo-600 shadow-violet/30 hover:-translate-y-0.5 hover:shadow-xl'
              }`}
            >
              {status === 'sending' ? 'Sending…' : status === 'ok' ? 'Message Sent! ✓' : status === 'error' ? 'Failed — Try Again' : 'Send Message →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
