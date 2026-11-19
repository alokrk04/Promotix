import { useEffect, useRef, useState } from 'react'
import { useForm, ValidationError } from '@formspree/react'
import Reveal from './Reveal'

const FORMSPREE_FORM_ID = 'maeojgkd'
const EMPTY_FORM = { name: '', email: '', mobile: '', company: '', location: '', service: '', message: '' }

export default function Contact({ content }) {
  const c = content || {}
  const [form, setForm] = useState(EMPTY_FORM)
  const [state, handleSubmit, resetFormspree] = useForm(FORMSPREE_FORM_ID)
  const resetRef = useRef(resetFormspree)
  resetRef.current = resetFormspree

  useEffect(() => {
    if (!state.succeeded) return
    setForm(EMPTY_FORM)
    const timer = setTimeout(() => resetRef.current(), 4000)
    return () => clearTimeout(timer)
  }, [state.succeeded])

  const formErrors = state.errors ? state.errors.getFormErrors() : []
  const status = state.submitting ? 'sending' : state.succeeded ? 'ok' : formErrors.length ? 'error' : ''
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const contactInfo = [
    { icon: '📍', label: 'Location', value: c.location || 'Nipani, Karnataka, India' },
    { icon: '📱', label: 'Phone', value: c.phone || '+91 93807 12430' },
    { icon: '✉️', label: 'Email', value: c.email || 'Promotix.officiall@gmail.com' },
    { icon: '⏰', label: 'Hours', value: c.hours || 'Mon–Sat, 9 AM – 7 PM IST' },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>, label: 'Instagram', value: c.instagram || '@promotix.official' },
  ]

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-cyan/5 to-transparent">
      <div className="section-shell max-w-6xl">
        <Reveal>
          <div className="text-center mb-12 sm:mb-16">
            <span className="tag">Get In Touch</span>
            <h2 className="sh mt-4">Let's Build Something <span className="gt">Extraordinary</span></h2>
            <p className="ss mx-auto">We respond within 24 hours.</p>
          </div>
        </Reveal>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:gap-12">
          <Reveal from="left">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold mb-7">Contact Information</h3>
              <div className="inline-block text-left space-y-5 w-full max-w-[360px] mx-auto lg:mx-0">
                {contactInfo.map((info, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center text-lg flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{info.label}</div>
                      {info.label === 'Instagram' ? <a href="https://www.instagram.com/promotix.official?igsh=bWFiaTJ0N2drNGkz" target="_blank" className="text-slate text-sm no-underline hover:text-violet transition-colors">{info.value}</a> : <div className="text-slate text-sm">{info.value}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal from="right" delay={120}>
            <form onSubmit={handleSubmit} className="gcard p-5 sm:p-8 lg:p-9">
            <h3 className="font-bold text-lg mb-5">Send Us a Message</h3>
            <input type="hidden" name="_subject" value="New contact message from Promotix website" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  className="w-full px-4 py-3 bg-black/[0.03] border border-black/10 rounded-xl outline-none focus:border-violet focus:bg-violet/5 text-sm transition-all"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={update('name')}
                  aria-invalid={state.errors?.getFieldErrors('name').length > 0}
                  required
                />
                <ValidationError field="name" errors={state.errors} className="mt-1 text-xs text-red-600" />
              </div>
              <div>
                <input
                  className="w-full px-4 py-3 bg-black/[0.03] border border-black/10 rounded-xl outline-none focus:border-violet focus:bg-violet/5 text-sm transition-all"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={update('email')}
                  aria-invalid={state.errors?.getFieldErrors('email').length > 0}
                  required
                />
                <ValidationError field="email" errors={state.errors} className="mt-1 text-xs text-red-600" />
              </div>
            </div>
            <input
              className="w-full px-4 py-3 bg-black/[0.03] border border-black/10 rounded-xl outline-none focus:border-violet focus:bg-violet/5 text-sm transition-all mb-4"
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={update('mobile')}
            />
            <input
              className="w-full px-4 py-3 bg-black/[0.03] border border-black/10 rounded-xl outline-none focus:border-violet focus:bg-violet/5 text-sm transition-all mb-4"
              name="company"
              placeholder="Company / Brand Name"
              value={form.company}
              onChange={update('company')}
            />
            <input
              className="w-full px-4 py-3 bg-black/[0.03] border border-black/10 rounded-xl outline-none focus:border-violet focus:bg-violet/5 text-sm transition-all mb-4"
              name="location"
              placeholder="Current Location"
              value={form.location}
              onChange={update('location')}
            />
            <select
              className="w-full px-4 py-3 bg-black/[0.03] border border-black/10 rounded-xl outline-none focus:border-violet focus:bg-violet/5 text-sm transition-all mb-4 appearance-none cursor-pointer"
              name="service"
              value={form.service}
              onChange={update('service')}
            >
              <option value="">Service Interested In</option>
              <option>Cinematic</option>
              <option>Promotion</option>
              <option>Monthly Growth Plan</option>
              <option>Premium</option>
            </select>
            <textarea
              className="w-full px-4 py-3 bg-black/[0.03] border border-black/10 rounded-xl outline-none focus:border-violet focus:bg-violet/5 text-sm transition-all min-h-[110px] resize-y"
              name="message"
              placeholder="Tell us about your project..."
              value={form.message}
              onChange={update('message')}
              aria-invalid={state.errors?.getFieldErrors('message').length > 0}
              required
            />
            <ValidationError field="message" errors={state.errors} className="mt-1 mb-4 text-xs text-red-600" />
            <button
              type="submit"
              disabled={state.submitting}
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
            {status === 'error' && formErrors.length > 0 && (
              <p className="mt-3 text-xs text-red-600 text-center" role="alert">{formErrors[0].message}</p>
            )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
