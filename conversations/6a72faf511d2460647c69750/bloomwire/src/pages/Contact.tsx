import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MailIcon, ClockIcon, PinIcon, PhoneIcon, ArrowRightIcon, CheckCircleIcon } from '../components/Icons'
import { useSEO } from '../hooks/useSEO'

export default function Contact() {
  useSEO({ title: "Bloomwire — Contact Us | Get in Touch", description: "Contact Bloomwire for orders, custom requests, partnerships, or support. Jaipur-based handcrafted flower studio. Grievance Officer available.", canonicalPath: "/#/contact" })

  const location = useLocation()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const msg = params.get('message')
    if (msg) {
      setForm((prev) => ({ ...prev, message: msg }))
    }
  }, [location.search])

  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    if (!form.name.trim()) { setFormError('Please enter your name'); return }
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setFormError('Please enter a valid email'); return }
    if (form.message.trim().length < 10) { setFormError('Message must be at least 10 characters'); return }
    setFormLoading(true)
    setTimeout(() => { setFormLoading(false); setFormSuccess('Message sent! We\'ll reply within 24 hours.'); setForm({ name: '', email: '', message: '' } as any) }, 1500)
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email.match(emailRegex)) return
    if (!form.name.trim() || !form.message.trim()) return
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setForm({ name: '', email: '', message: '' } as any)
    }, 3000)
  }

  const contactInfo = [
    { Icon: MailIcon, title: 'Email', lines: ['hello@bloomwire.in', 'orders@bloomwire.in'] },
    { Icon: ClockIcon, title: 'Hours', lines: ['Mon – Sat: 10am – 6pm IST', 'Sunday: Closed'] },
    { Icon: PinIcon, title: 'Studio', lines: ['Bloomwire Handcraft Studio', 'Jaipur, Rajasthan, India'] },
    { Icon: PhoneIcon, title: 'Phone', lines: ['+91 94140 27836', 'Mon – Sat, 10am – 6pm IST'] },
  ]

  const socials = [
    { name: 'Instagram', href: 'https://www.instagram.com/bloomwire._', svg: <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></> },
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61592187074281', svg: <><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></> },
    { name: 'WhatsApp', href: 'https://wa.me/message/VT4TW64X2EJKH1', svg: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></> },
    { name: 'Threads', href: 'https://www.threads.com/@bloomwire2000', svg: <><path d="M12 2C6.5 2 4 5 4 9c0 2 .8 3.5 2 4.5-1.3 1-2 2.5-2 4.3 0 3.2 2.7 4.2 5.5 4.2 4 0 6.5-2 6.5-6 0-1.8-.6-3-1.7-3.8.5-.6.7-1.4.7-2.2 0-2-1.5-3-3.5-3-1.5 0-2.5.6-3 1.5" /></> },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
      <div className="text-center mb-12">
        <p className="text-xs font-medium tracking-widest text-bloom-neon uppercase mb-3">Get in Touch</p>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold mb-4">Contact <span className="gradient-text">Us</span></h1>
        <p className="text-[#a0918a]">We'd love to hear from you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact info */}
        <div className="space-y-6">
          {contactInfo.map((info, i) => (
            <div key={i} className="glass-strong rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-bloom-rose/10 flex items-center justify-center flex-shrink-0">
                <info.Icon size={22} className="text-bloom-neon" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg mb-1">{info.title}</h3>
                {info.lines.map((l, j) => <p key={j} className="text-sm text-[#a0918a]">{l}</p>)}
              </div>
            </div>
          ))}

          {/* Social media with SVG logos */}
          <div className="glass-strong rounded-2xl p-6">
            <h3 className="font-serif font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full glass flex items-center justify-center text-[#8a7a6a] hover:text-bloom-neon hover:neon-border transition" aria-label={social.name}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{social.svg}</svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="glass-strong rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#6b5d4f] mb-1 block">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#2d2418]/10 text-[#2d2418] placeholder-[#a0918a] focus:border-bloom-neon focus:bg-white/70 glow-focus transition outline-none" placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#6b5d4f] mb-1 block">Email</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#2d2418]/10 text-[#2d2418] placeholder-[#a0918a] focus:border-bloom-neon focus:bg-white/70 glow-focus transition outline-none" placeholder="you@email.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#6b5d4f] mb-1 block">Message</label>
              <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={6} className="w-full px-4 py-3 rounded-xl bg-white/60 border border-[#2d2418]/10 text-[#2d2418] placeholder-[#a0918a] focus:border-bloom-neon focus:bg-white/70 glow-focus transition resize-none outline-none" placeholder="How can we help?" />
            </div>
            {formError && <p className="text-xs text-red-400 mb-3">{formError}</p>}
          {formSuccess && <p className="text-xs text-emerald-400 mb-3">{formSuccess}</p>}
          <button type="submit" className="w-full px-6 py-3.5 bg-gradient-to-r from-bloom-rose to-bloom-wine text-white rounded-full font-medium shimmer-btn neon-glow hover:scale-105 transition flex items-center justify-center gap-2">
              {formLoading ? <>Sending...</> : formSuccess ? <><CheckCircleIcon size={18} /> Sent!</> : sent ? <><CheckCircleIcon size={18} /> Message Sent!</> : <>Send Message <ArrowRightIcon size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    
        {/* Grievance Officer Section */}
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto glass rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-serif font-bold text-[#2d2418] mb-4">Grievance Officer</h2>
            <p className="text-sm text-[#8a7a6a] mb-4">As required under the Consumer Protection (E-Commerce) Rules, 2020</p>
            <div className="space-y-2 text-sm text-[#6b5d4f]">
              <p><span className="text-[#a0918a]">Name:</span> Somil Sharma</p>
              <p><span className="text-[#a0918a]">Designation:</span> Grievance Officer</p>
              <p><span className="text-[#a0918a]">Email:</span> <a href="mailto:hello@bloomwire.in" className="text-bloom-neon hover:underline">hello@bloomwire.in</a></p>
              <p><span className="text-[#a0918a]">Phone:</span> +91 94140 27836</p>
              <p><span className="text-[#a0918a]">Working Hours:</span> Monday to Saturday, 10:00 AM to 6:00 PM IST</p>
              <p><span className="text-[#a0918a]">Response Time:</span> Acknowledgment within 48 hours, resolution within 30 days</p>
            </div>
            <p className="text-xs text-[#a0918a] mt-4">If your grievance is not resolved, you may approach the Consumer Disputes Redressal Commission or file a complaint through the National Consumer Helpline (1915) or consumerhelpline.gov.in</p>
          </div>
        </section>
</div>
  )
}
