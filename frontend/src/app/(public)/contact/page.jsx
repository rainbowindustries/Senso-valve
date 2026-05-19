'use client'
import { useState } from 'react'
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconBrandWhatsapp,
  IconSend,
  IconClock,
} from '@tabler/icons-react'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
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
        setForm({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: '',
        })
      } else {
        setError(data.message || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to send inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>

      {/* Hero */}
      <section className="bg-[#0f172a] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] text-blue-500 uppercase tracking-widest font-medium mb-3">
            Contact us
          </p>
          <h1 className="text-[36px] font-medium text-white tracking-tight mb-4">
            Get in touch
          </h1>
          <p className="text-[15px] text-slate-400 max-w-xl leading-relaxed">
            Our engineering team responds within 24 hours with technical specifications and pricing.
          </p>
        </div>
      </section>

      {/* Contact content */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left — contact info */}
          <div className="flex flex-col gap-6">

            {/* Contact details */}
            <div>
              <h2 className="text-[18px] font-medium text-slate-900 mb-6">
                Contact information
              </h2>
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconPhone size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-[12px] text-slate-400 mb-1">Phone</div>
                    <a
                      href="tel:+919876543210"
                      className="text-[14px] text-slate-900 hover:text-blue-500 transition-colors"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconMail size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-[12px] text-slate-400 mb-1">Email</div>
                    <a
                      href="mailto:tempjkjd@gmail.com"
                      className="text-[14px] text-slate-900 hover:text-blue-500 transition-colors"
                    >
                      tempjkjd@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconMapPin size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-[12px] text-slate-400 mb-1">Address</div>
                    <div className="text-[14px] text-slate-900 leading-relaxed">
                      Plot No. 12, GIDC Estate<br />
                      Rajkot — 360002<br />
                      Gujarat, India
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconClock size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-[12px] text-slate-400 mb-1">Working hours</div>
                    <div className="text-[14px] text-slate-900">
                      Mon – Sat: 9:00 AM – 6:00 PM
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-3.5 rounded-xl transition-colors"
            >
              <IconBrandWhatsapp size={22} />
              <div>
                <div className="text-[14px] font-medium">Chat on WhatsApp</div>
                <div className="text-[11px] text-green-100">Usually replies within minutes</div>
              </div>
            </a>

            {/* Google Map */}
            <div className="rounded-xl overflow-hidden border border-slate-200 h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.1!2d70.7!3d22.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDE4JzAwLjAiTiA3MMKwNDInMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right — inquiry form */}
          <div className="lg:col-span-2">
            <h2 className="text-[18px] font-medium text-slate-900 mb-6">
              Send an inquiry
            </h2>

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconSend size={24} className="text-green-500" />
                </div>
                <h3 className="text-[18px] font-medium text-slate-900 mb-2">
                  Inquiry sent successfully!
                </h3>
                <p className="text-[13px] text-slate-500 mb-6">
                  Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-[13px] text-blue-500 hover:text-blue-600"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                      Full name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                      Email address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone + Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                      Company name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Your company"
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-[12px] text-slate-500 font-medium mb-1.5 block">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us about your requirements — valve type, size, quantity, application..."
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors resize-none"
                  />
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[13px] text-red-600">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] disabled:bg-slate-300 text-white text-[14px] font-medium px-8 py-3 rounded-lg transition-colors w-full sm:w-auto"
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
            )}
          </div>
        </div>
      </section>

    </main>
  )
}