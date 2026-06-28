'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconBrandWhatsapp,
  IconSend,
  IconClock,
  IconPackage,
  IconX,
} from '@tabler/icons-react'
import { useInView } from 'react-intersection-observer'

function FadeUp({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                     transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

const inputClass = `
  w-full
  border-2 border-slate-300
  rounded-xl
  px-4 py-3
  text-[14px] text-slate-900
  placeholder-slate-400
  bg-white
  focus:outline-none
  focus:border-[#1a2e44]
  focus:ring-2
  focus:ring-[#1a2e44]/10
  transition-all
  font-medium
`

// ─── Form (reads URL params) ───────────────────────
function InquiryForm() {
  const searchParams = useSearchParams()
  const productName = searchParams.get('product')
  const productId = searchParams.get('product_id')

  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', message: '',
    product_id: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [activeProductName, setActiveProductName] = useState(productName)

  useEffect(() => {
    if (productName) {
      setForm(prev => ({
        ...prev,
        message: `I am interested in ${productName}. Please share specifications and pricing details.`,
        product_id: productId || '',
      }))
      setActiveProductName(productName)
    }
  }, [productName, productId])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const clearProduct = () => {
    setForm(prev => ({ ...prev, message: '', product_id: '' }))
    setActiveProductName(null)
    window.history.replaceState({}, '', '/contact')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inquiries`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      )
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
        setForm({ name: '', email: '', phone: '', company: '', message: '', product_id: '' })
      } else {
        setError(data.message || 'Something went wrong')
      }
    } catch {
      setError('Failed to send inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconSend size={24} className="text-green-500" />
        </div>
        <h3 className="text-[18px] font-bold text-slate-900 mb-2">
          Inquiry sent successfully!
        </h3>
        <p className="text-[13px] text-slate-500 mb-6">
          Our team will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-[13px] font-medium text-[#4A7FA5] hover:text-[#1a2e44] transition-colors"
        >
          Send another inquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Product reference badge */}
      {activeProductName && (
        <div className="flex items-center justify-between gap-3 bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconPackage size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="text-[11px] text-blue-500 uppercase tracking-wider font-medium">
                Inquiring about
              </div>
              <div className="text-[14px] font-semibold text-slate-900">
                {activeProductName}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={clearProduct}
            className="w-7 h-7 rounded-lg hover:bg-blue-100 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <IconX size={14} className="text-blue-400" />
          </button>
        </div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[12px] text-slate-600 font-semibold mb-2 block uppercase tracking-wider">
            Full name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-[12px] text-slate-600 font-semibold mb-2 block uppercase tracking-wider">
            Email address *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
      </div>

      {/* Phone + Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[12px] text-slate-600 font-semibold mb-2 block uppercase tracking-wider">
            Phone number
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-[12px] text-slate-600 font-semibold mb-2 block uppercase tracking-wider">
            Company name
          </label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Your company"
            className={inputClass}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="text-[12px] text-slate-600 font-semibold mb-2 block uppercase tracking-wider">
          Message *
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Tell us about your requirements — valve type, size, quantity, application..."
          className={inputClass + ' resize-none'}
        />
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-700 font-medium">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-[#1a2e44] hover:bg-[#142438] disabled:bg-slate-300 text-white text-[14px] font-semibold px-8 py-3.5 rounded-xl transition-colors w-full sm:w-auto"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <IconSend size={16} />
            Send inquiry
          </>
        )}
      </button>

    </form>
  )
}

// ─── Page ──────────────────────────────────────────
export default function ContactPage() {
  return (
    <main className="bg-white">

      {/* Hero */}
      <section className="bg-[#1a2e44] py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <FadeUp delay={0}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-0.5 bg-[#4A7FA5] rounded-full" />
              <span className="text-[11px] font-medium text-[#4A7FA5] uppercase tracking-[2px]">
                Contact us
              </span>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <h1 className="text-[36px] md:text-[44px] font-bold text-white tracking-tight mb-4">
              Get in touch
            </h1>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="text-[15px] text-white/55 max-w-xl leading-relaxed">
              Our engineering team responds within 24 hours with technical specifications and pricing.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Contact info + Form */}
      <section className="py-20 px-6 md:px-10 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left — contact info */}
          <FadeUp delay={0}>
            <div className="flex flex-col gap-5">
              <h2 className="text-[20px] font-bold text-slate-900 mb-2">
                Contact information
              </h2>

              {[
                {
                  icon: IconPhone,
                  label: 'Phone',
                  content: <a href="tel:+919909954311" className="text-[14px] font-semibold text-slate-900 hover:text-[#4A7FA5] transition-colors">+91 99099 54311</a>,
                },
                {
                  icon: IconMail,
                  label: 'Email',
                  content: <a href="mailto:tempjkjd@gmail.com" className="text-[14px] font-semibold text-slate-900 hover:text-[#4A7FA5] transition-colors">info@hammervalve.com</a>,
                },
                {
                  icon: IconMapPin,
                  label: 'Address',
                  content: <div className="text-[14px] font-medium text-slate-900 leading-relaxed">Plot No. 12, GIDC Estate<br />Rajkot — 360002<br />Gujarat, India</div>,
                },
                {
                  icon: IconClock,
                  label: 'Working hours',
                  content: <div className="text-[14px] font-medium text-slate-900">Mon – Sat: 9:00 AM – 6:00 PM</div>,
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-start gap-4 p-4 bg-white border border-[#E5E2DC] rounded-xl hover:border-[#C8D4E0] transition-all">
                    <div className="w-10 h-10 bg-[#EEF2F7] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={18} color="#4A7FA5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-1">
                        {item.label}
                      </div>
                      {item.content}
                    </div>
                  </div>
                )
              })}

              <a
                href="https://wa.me/919909954311"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-4 rounded-xl transition-colors"
              >
                <IconBrandWhatsapp size={22} />
                <div>
                  <div className="text-[14px] font-semibold">Chat on WhatsApp</div>
                  <div className="text-[11px] text-green-100">Usually replies within minutes</div>
                </div>
              </a>
            </div>
          </FadeUp>

          {/* Right — form */}
          <FadeUp delay={150} className="lg:col-span-2">
            <div className="bg-white border border-[#E5E2DC] rounded-2xl p-8">
              <h2 className="text-[20px] font-bold text-slate-900 mb-6">
                Send an inquiry
              </h2>

              <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="w-7 h-7 border-2 border-[#1a2e44]/20 border-t-[#1a2e44] rounded-full animate-spin" />
                </div>
              }>
                <InquiryForm />
              </Suspense>
            </div>
          </FadeUp>

        </div>
      </section>

      {/* Map */}
      <section className="px-6 md:px-10 pb-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto">
          <FadeUp delay={0}>
            <h2 className="text-[20px] font-bold text-slate-900 mb-5">
              Find us on map
            </h2>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="rounded-2xl overflow-hidden border-2 border-[#E5E2DC] shadow-md" style={{ height: '450px' }}>
              <iframe
                src="https://www.google.com/maps?q=22.2266486,70.797714&hl=en&z=17&t=m&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeUp>
        </div>
      </section>

    </main>
  )
}