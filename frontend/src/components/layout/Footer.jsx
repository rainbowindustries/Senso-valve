'use client'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import {
  IconSettings2,
  IconPhone,
  IconMail,
  IconMapPin,
  IconClock,
  IconBrandWhatsapp,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconArrowUpRight,
} from '@tabler/icons-react'

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
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })
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

function ColLabel({ children }) {
  return (
    <p className="text-[11px] font-bold text-slate-900 uppercase tracking-[1.5px] mb-5">
      {children}
    </p>
  )
}

export default function Footer() {
  return (
    <footer className="bg-white">

      {/* CTA banner */}
      <div className="bg-[#1a2e44]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <FadeUp delay={0}>
            <div>
              <h3 className="text-[20px] sm:text-[22px] font-bold text-white mb-1">
                Need the right valve for your application?
              </h3>
              <p className="text-[13px] text-white/50">
                Our engineering team replies within 24 hours.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={100} className="flex-shrink-0">
            <div className="flex gap-3">
              <a
                href="https://wa.me/919909954311"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-[13px] font-semibold px-5 py-3 rounded-xl no-underline transition-colors duration-200"
              >
                <IconBrandWhatsapp size={16} strokeWidth={1.6} />
                WhatsApp
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-2 bg-white hover:bg-slate-100 text-[#1a2e44] text-[13px] font-semibold px-5 py-3 rounded-xl no-underline transition-colors duration-200"
              >
                Get a Quote
                <IconArrowUpRight size={14} strokeWidth={2} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] gap-x-8 gap-y-12">

          {/* Brand */}
          <FadeUp delay={0}>
            <Link href="/" className="flex items-center gap-3 no-underline mb-5">
              <div className="w-11 h-11 rounded-xl bg-[#1a2e44] flex items-center justify-center flex-shrink-0">
                <IconSettings2 size={21} color="#93C5FD" strokeWidth={1.6} />
              </div>
              <div>
                <div className="text-[16px] font-bold text-slate-900 leading-tight">
                  Hammer Valve
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-[1.8px] font-medium">
                  Industries · Est. 2001
                </div>
              </div>
            </Link>
            <p className="text-[13.5px] text-slate-500 leading-relaxed max-w-[320px] mb-6">
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
            <ColLabel>Pages</ColLabel>
            <div className="flex flex-col gap-3">
              {pages.map(p => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="text-[13.5px] text-slate-500 hover:text-[#1a2e44] no-underline transition-colors duration-150 w-fit"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </FadeUp>

          {/* Support */}
          <FadeUp delay={140}>
            <ColLabel>Support</ColLabel>
            <div className="flex flex-col gap-3">
              {support.map(p => (
                <Link
                  key={p.label}
                  href={p.href}
                  className="text-[13.5px] text-slate-500 hover:text-[#1a2e44] no-underline transition-colors duration-150 w-fit"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </FadeUp>

          {/* Contact card */}
          <FadeUp delay={200}>
            <ColLabel>Get in Touch</ColLabel>
            <div className="flex flex-col gap-4">
              <a href="tel:+919909954311" className="flex items-start gap-3 no-underline group">
                <div className="w-9 h-9 rounded-lg bg-slate-50 group-hover:bg-[#1a2e44] flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                  <IconPhone size={15} className="text-slate-500 group-hover:text-white transition-colors duration-200" strokeWidth={1.6} />
                </div>
                <div className="pt-1.5">
                  <div className="text-[13.5px] font-medium text-slate-700 group-hover:text-[#1a2e44] transition-colors duration-150">
                    +91 99099 54311
                  </div>
                </div>
              </a>
              <a href="mailto:info@hammervalve.com" className="flex items-start gap-3 no-underline group">
                <div className="w-9 h-9 rounded-lg bg-slate-50 group-hover:bg-[#1a2e44] flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                  <IconMail size={15} className="text-slate-500 group-hover:text-white transition-colors duration-200" strokeWidth={1.6} />
                </div>
                <div className="pt-1.5">
                  <div className="text-[13.5px] font-medium text-slate-700 group-hover:text-[#1a2e44] transition-colors duration-150">
                    info@hammervalve.com
                  </div>
                </div>
              </a>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <IconMapPin size={15} className="text-slate-500" strokeWidth={1.6} />
                </div>
                <div className="text-[13.5px] text-slate-700 leading-relaxed pt-1.5">
                  Plot No. 12, GIDC Estate,<br />Rajkot — 360002, Gujarat
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <IconClock size={15} className="text-slate-500" strokeWidth={1.6} />
                </div>
                <div className="text-[13.5px] text-slate-700 leading-relaxed pt-1.5">
                  Mon – Sat, 9:00 AM – 6:00 PM
                </div>
              </div>
            </div>
          </FadeUp>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-100">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[12.5px] text-slate-400 text-center sm:text-left">
            © {new Date().getFullYear()} Hammer Valve Industries. All rights reserved.
          </span>
          <span className="text-[12.5px] text-slate-400">
            Rajkot, Gujarat, India 🇮🇳
          </span>
        </div>
      </div>

    </footer>
  )
}