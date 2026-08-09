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

// ─── FadeUp Animation Component ─────────────────────
function FadeUp({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
                     transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

const inputClass = `
  w-full
  border border-[#E5E2DC]
  rounded-xl
  px-4 py-3
  text-[14px] text-slate-900
  placeholder-slate-400
  bg-white
  focus:outline-none
  focus:border-[#0A8F8A]
  focus:ring-2
  focus:ring-[#0A8F8A]/10
  transition-all
  duration-300
  font-medium
`

// ─── Form Component (Reads URL parameters) ───────────
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
        message: `I am interested in ${productName}. Please share technical specifications, valve pressure ratings, and pricing details.`,
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
      const res = await fetch(
        `${apiUrl}/inquiries`,
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
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center animate-fade-up">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconSend size={24} className="text-emerald-600" />
        </div>
        <h3 className="text-[18px] font-bold text-slate-900 mb-2">
          Inquiry sent successfully!
        </h3>
        <p className="text-[13px] text-slate-500 mb-6 font-light">
          Our valve engineering team will get back to you within 24 hours with technical datasheets and quote.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-[13px] font-bold text-[#0A8F8A] hover:text-[#087C77] transition-colors duration-200"
        >
          Send another valve inquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {activeProductName && (
        <div className="flex items-center justify-between gap-3 bg-[#EBF5F4] border border-[#0A8F8A]/35 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0A8F8A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconPackage size={16} className="text-[#0A8F8A]" />
            </div>
            <div>
              <div className="text-[10.5px] text-[#0A8F8A] uppercase tracking-wider font-bold">
                Inquiring about
              </div>
              <div className="text-[14px] font-bold text-slate-800">
                {activeProductName}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={clearProduct}
            className="w-7 h-7 rounded-lg hover:bg-[#0A8F8A]/10 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <IconX size={14} className="text-[#0A8F8A]" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] text-slate-500 font-bold mb-2 block uppercase tracking-wider">
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
          <label className="text-[11px] text-slate-500 font-bold mb-2 block uppercase tracking-wider">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] text-slate-500 font-bold mb-2 block uppercase tracking-wider">
            Phone number
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 9XXXXXXXXX"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-[11px] text-slate-500 font-bold mb-2 block uppercase tracking-wider">
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

      <div>
        <label className="text-[11px] text-slate-500 font-bold mb-2 block uppercase tracking-wider">
          Message *
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Tell us about your requirements — valve type (ball, gate, globe, butterfly, check), pressure rating, size, quantity..."
          className={inputClass + ' resize-none'}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-700 font-medium">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-[#0A8F8A] hover:bg-[#087C77] disabled:bg-slate-300 text-white text-[14px] font-bold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md w-full sm:w-auto"
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

export default function ContactClient() {
  return (
    <main className="bg-white min-h-screen font-sans overflow-hidden">

      {/* Hero Header Section */}
      <section className="bg-[#1E4356] py-16 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
        <div className="absolute left-10 top-5 w-40 h-40 bg-[#EF8135]/[0.05] rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <FadeUp delay={0}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-0.5 bg-[#EF8135] rounded-full" />
              <span className="text-[11px] font-bold text-white/80 uppercase tracking-[2.5px]">
                Contact us
              </span>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <h1 className="text-[36px] md:text-[44px] font-extrabold text-white tracking-tight leading-tight mb-4">
              Contact Vertex Valve Engineering Team
            </h1>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="text-[15px] sm:text-[16px] text-white/80 max-w-xl leading-relaxed">
              Our industrial valve experts respond within 24 hours with technical specifications, valve pressure charts, and pricing details.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Contact info blocks + Form layout */}
      <section className="py-20 px-6 md:px-10 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left Column — Contact Information cards */}
          <FadeUp delay={0}>
            <div className="flex flex-col gap-5">
              <h2 className="text-[20px] font-bold text-slate-900 mb-3 tracking-tight">
                Contact information
              </h2>

              {[
                {
                  icon: IconPhone,
                  label: 'Phone',
                  content: <a href="tel:+919327841813" className="text-[14.5px] font-bold text-slate-900 hover:text-[#0A8F8A] transition-colors">+91 93278 41813</a>,
                },
                {
                  icon: IconMail,
                  label: 'Email',
                  content: <a href="mailto:infovertexvalve78@gmail.com" className="text-[14.5px] font-bold text-slate-900 hover:text-[#0A8F8A] transition-colors">infovertexvalve78@gmail.com <br/>Salesvertexvalve78@gmail.com</a>,
                },
                {
                  icon: IconMapPin,
                  label: 'Address',
                  content: <div className="text-[14px] font-bold text-slate-800 leading-relaxed">Rani industries Estate, Division-1, Plot No. 52,<br />B/h. Parin Furniture, Gondal Road,<br />N.H. 8-B, Vill.Vavdi,<br/>Dist.:Rajkot, Pincode:360004</div>,
                },
                {
                  icon: IconClock,
                  label: 'Working hours',
                  content: <div className="text-[14px] font-bold text-slate-800"> 8:00 AM – 8:00 PM</div>,
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="group flex items-start gap-4 p-5 bg-white border border-[#E5E2DC] rounded-2xl hover:border-[#0A8F8A]/45 hover:-translate-y-0.5 hover:shadow-md transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <div className="w-10 h-10 bg-[#EEF2F7] rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#0A8F8A]/10">
                      <Icon size={18} className="text-[#0A8F8A] transition-colors" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                        {item.label}
                      </div>
                      {item.content}
                    </div>
                  </div>
                )
              })}

              <a
                href="https://wa.me/919327841813"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-4 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <IconBrandWhatsapp size={22} />
                <div>
                  <div className="text-[14px] font-bold leading-snug">Chat on WhatsApp</div>
                  <div className="text-[11px] text-green-100 font-light">Direct connection with valve engineering team</div>
                </div>
              </a>
            </div>
          </FadeUp>

          {/* Right Column — Inquiry form */}
          <FadeUp delay={150} className="lg:col-span-2">
            <div className="bg-white border border-[#E5E2DC] rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-[20px] font-bold text-slate-900 mb-6 tracking-tight">
                Request Industrial Valve Quote & Specifications
              </h2>

              <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-[#0A8F8A]/30 border-t-[#0A8F8A] rounded-full animate-spin" />
                </div>
              }>
                <InquiryForm />
              </Suspense>
            </div>
          </FadeUp>

        </div>
      </section>

      {/* Map Section */}
      <section className="px-6 md:px-10 pb-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto">
          <FadeUp delay={0}>
            <h2 className="text-[20px] font-bold text-slate-900 mb-5 tracking-tight">
              Vertex Valve Manufacturing Plant Location - Rajkot, Gujarat
            </h2>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="rounded-2xl overflow-hidden border border-[#E5E2DC] shadow-md hover:shadow-lg hover:border-[#0A8F8A]/20 transition-all duration-[600ms]" style={{ height: '450px' }}>
              <iframe
                src="https://www.google.com/maps?q=22.2266486,70.797714&hl=en&z=17&t=m&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vertex Valve Rajkot Plant Location"
              />
            </div>
          </FadeUp>
        </div>
      </section>

    </main>
  )
}
