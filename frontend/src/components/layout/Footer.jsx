'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconClock,
  IconBrandWhatsapp,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconArrowUpRight,
  IconChevronDown,
} from '@tabler/icons-react'
import { useState } from 'react'

const pages = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Applications', href: '/application' },
  { label: 'Catalogue', href: '/catalogue' },
  { label: 'Gallery', href: '/gallery' },
]

const support = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Certificates', href: '/about#certifications' },
  { label: 'Get a Quote', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
]

const social = [
  { label: 'Facebook', href: 'https://facebook.com', icon: IconBrandFacebook },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: IconBrandLinkedin },
]

function FadeUp({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.06 })
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                     transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// Mobile accordion section
function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full py-4 text-left bg-transparent border-none cursor-pointer"
      >
        <span className="text-[12px] font-bold text-slate-900 uppercase tracking-[1.5px]">
          {title}
        </span>
        <IconChevronDown
          size={16}
          strokeWidth={2}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'max-h-[400px] pb-4' : 'max-h-0'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-white">

      {/* CTA banner */}
      <div className="bg-[#1a2e44]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-10 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <FadeUp delay={0}>
              <div>
                <h3 className="text-[17px] sm:text-[20px] lg:text-[22px] font-bold text-white mb-1 leading-snug">
                  Need the right valve for your application?
                </h3>
                <p className="text-[13px] text-white/50">
                  Our engineering team replies within 24 hours.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={100} className="flex-shrink-0 w-full sm:w-auto">
              <div className="flex gap-3 w-full sm:w-auto">
                <a
                  href="https://wa.me/919909954311"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-[13px] font-semibold px-4 sm:px-5 py-3 rounded-xl no-underline transition-colors duration-200"
                >
                  <IconBrandWhatsapp size={16} strokeWidth={1.6} />
                  WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-[#1a2e44] text-[13px] font-semibold px-4 sm:px-5 py-3 rounded-xl no-underline transition-colors duration-200"
                >
                  Get a Quote
                  <IconArrowUpRight size={14} strokeWidth={2} />
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>

      {/* ── DESKTOP layout (lg+) ─────────────────────── */}
      <div className="hidden lg:block max-w-[1280px] mx-auto px-10 py-16">
        <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_1fr] gap-x-10 gap-y-12">

          {/* Brand */}
          <FadeUp delay={0}>
            <Link href="/" className="flex items-center mb-5 no-underline">
              <Image
                src="/Vertex_Valve_logo.png"
                alt="Company Logo"
                width={160}
                height={52}
                className="h-25 w-auto"
                priority
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </Link>
            <p className="text-[13.5px] text-slate-500 leading-relaxed max-w-[300px] mb-6">
              Manufacturer & exporter of industrial valves and automation solutions, serving global industries since 2001 from Rajkot, Gujarat.
            </p>
            <div className="flex gap-2.5">
              {social.map(s => {
                const Icon = s.icon
                return (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-[#1a2e44] flex items-center justify-center transition-colors duration-200 group"
                  >
                    <Icon size={17} className="text-slate-500 group-hover:text-white transition-colors duration-200" strokeWidth={1.6} />
                  </a>
                )
              })}
            </div>
          </FadeUp>

          {/* Pages */}
          <FadeUp delay={80}>
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-[1.5px] mb-5">Pages</p>
            <div className="flex flex-col gap-3">
              {pages.map(p => (
                <Link key={p.href} href={p.href} className="text-[13.5px] text-slate-500 hover:text-[#1a2e44] no-underline transition-colors duration-150 w-fit">
                  {p.label}
                </Link>
              ))}
            </div>
          </FadeUp>

          {/* Support */}
          <FadeUp delay={140}>
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-[1.5px] mb-5">Support</p>
            <div className="flex flex-col gap-3">
              {support.map(p => (
                <Link key={p.label} href={p.href} className="text-[13.5px] text-slate-500 hover:text-[#1a2e44] no-underline transition-colors duration-150 w-fit">
                  {p.label}
                </Link>
              ))}
            </div>
          </FadeUp>

          {/* Contact */}
          <FadeUp delay={200}>
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-[1.5px] mb-5">Get in Touch</p>
            <div className="flex flex-col gap-4">
              <a href="tel:+919909954311" className="flex items-start gap-3 no-underline group">
                <div className="w-9 h-9 rounded-lg bg-slate-50 group-hover:bg-[#1a2e44] flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                  <IconPhone size={15} className="text-slate-500 group-hover:text-white transition-colors duration-200" strokeWidth={1.6} />
                </div>
                <div className="text-[13.5px] font-medium text-slate-700 group-hover:text-[#1a2e44] transition-colors pt-1.5">+91 99099 54311</div>
              </a>
              <a href="mailto:info@hammervalve.com" className="flex items-start gap-3 no-underline group">
                <div className="w-9 h-9 rounded-lg bg-slate-50 group-hover:bg-[#1a2e44] flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                  <IconMail size={15} className="text-slate-500 group-hover:text-white transition-colors duration-200" strokeWidth={1.6} />
                </div>
                <div className="text-[13.5px] font-medium text-slate-700 group-hover:text-[#1a2e44] transition-colors pt-1.5 break-all">info@hammervalve.com</div>
              </a>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <IconMapPin size={15} className="text-slate-500" strokeWidth={1.6} />
                </div>
                <div className="text-[13.5px] text-slate-700 leading-relaxed pt-1.5">Plot No. 12, GIDC Estate,<br />Rajkot — 360002, Gujarat</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <IconClock size={15} className="text-slate-500" strokeWidth={1.6} />
                </div>
                <div className="text-[13.5px] text-slate-700 leading-relaxed pt-1.5">Mon – Sat, 9:00 AM – 6:00 PM</div>
              </div>
            </div>
          </FadeUp>

        </div>
      </div>

      {/* ── MOBILE + TABLET layout (below lg) ──────── */}
      <div className="lg:hidden max-w-[1280px] mx-auto px-4 sm:px-8 pt-8 pb-4">

        {/* Brand section — always visible */}
        <div className="flex flex-col items-start gap-4 mb-6 pb-6 border-b border-slate-100">
          <Link href="/" className="flex items-center no-underline">
            <Image
              src="/Vertex_Valve_logo.png"
              alt="Company Logo"
              width={140}
              height={46}
              className="h-20 w-auto"
              priority
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </Link>
          <p className="text-[13px] text-slate-500 leading-relaxed max-w-sm">
            Manufacturer & exporter of industrial valves, serving global industries since 2001 from Rajkot, Gujarat.
          </p>
          <div className="flex gap-2.5">
            {social.map(s => {
              const Icon = s.icon
              return (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-[#1a2e44] flex items-center justify-center transition-colors duration-200 group"
                >
                  <Icon size={17} className="text-slate-500 group-hover:text-white transition-colors duration-200" strokeWidth={1.6} />
                </a>
              )
            })}
          </div>
        </div>

        {/* Contact info — always visible on mobile too */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2 pb-6 border-b border-slate-100">
          <a href="tel:+919909954311" className="flex items-center gap-3 no-underline bg-slate-50 rounded-xl px-4 py-3 hover:bg-slate-100 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <IconPhone size={15} className="text-[#1a2e44]" strokeWidth={1.6} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Call us</div>
              <div className="text-[13px] font-semibold text-slate-800">+91 99099 54311</div>
            </div>
          </a>
          <a href="mailto:info@hammervalve.com" className="flex items-center gap-3 no-underline bg-slate-50 rounded-xl px-4 py-3 hover:bg-slate-100 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <IconMail size={15} className="text-[#1a2e44]" strokeWidth={1.6} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Email us</div>
              <div className="text-[13px] font-semibold text-slate-800 truncate">info@hammervalve.com</div>
            </div>
          </a>
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <IconMapPin size={15} className="text-[#1a2e44]" strokeWidth={1.6} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Address</div>
              <div className="text-[13px] font-semibold text-slate-800">Rajkot, Gujarat, India</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <IconClock size={15} className="text-[#1a2e44]" strokeWidth={1.6} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Hours</div>
              <div className="text-[13px] font-semibold text-slate-800">Mon–Sat, 9AM–6PM</div>
            </div>
          </div>
        </div>

        {/* Accordion links */}
        <AccordionSection title="Pages">
          <div className="flex flex-col gap-2.5">
            {pages.map(p => (
              <Link key={p.href} href={p.href} className="text-[14px] text-slate-500 hover:text-[#1a2e44] no-underline transition-colors pl-1">
                {p.label}
              </Link>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Support">
          <div className="flex flex-col gap-2.5">
            {support.map(p => (
              <Link key={p.label} href={p.href} className="text-[14px] text-slate-500 hover:text-[#1a2e44] no-underline transition-colors pl-1">
                {p.label}
              </Link>
            ))}
          </div>
        </AccordionSection>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-100 mt-4 sm:mt-0">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-10 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[12px] sm:text-[12.5px] text-slate-400 text-center sm:text-left">
            © {new Date().getFullYear()} Hammer Valve Industries. All rights reserved.
          </span>
          <span className="text-[12px] sm:text-[12.5px] text-slate-400">
            Rajkot, Gujarat, India 🇮🇳
          </span>
        </div>
      </div>

    </footer>
  )
}