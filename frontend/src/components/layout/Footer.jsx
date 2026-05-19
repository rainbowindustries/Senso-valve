import Link from 'next/link'
import {
  IconSettings2, IconPhone, IconMail,
  IconMapPin, IconBrandWhatsapp
} from '@tabler/icons-react'

const products = [
  { label: 'Ball valves', href: '/products/manual/ball-valve' },
  { label: 'Gate valves', href: '/products/manual/gate-valve' },
  { label: 'Globe valves', href: '/products/manual/globe-valve' },
  { label: 'Butterfly valves', href: '/products/manual/butterfly-valve' },
  { label: 'Check valves', href: '/products/manual/check-valve' },
  { label: 'Actuators', href: '/products/automation/pneumatic-actuator' },
]

const company = [
  { label: 'About us', href: '/about' },
  { label: 'Certifications', href: '/about#certifications' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Catalogue', href: '/catalogue' },
]

const contact = [
  { label: 'Send enquiry', href: '/contact' },
  { label: 'WhatsApp us', href: 'https://wa.me/919876543210' },
  { label: 'Find us on map', href: 'https://maps.google.com' },
]

export default function Footer() {
  return (
    <footer>

      {/* Main Footer */}
      <div className="bg-[#0a1120] px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
                <IconSettings2 size={18} color="#60a5fa" />
              </div>
              <div className="text-[15px] font-medium text-white">
                Hammer Valve
              </div>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed mb-5">
              Manufacturer & exporter of industrial valves and automation solutions. Serving global industries since 2001 from Rajkot, Gujarat.
            </p>
            <div className="flex flex-col gap-2.5">
              <a href="tel:+919876543210" className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-blue-400 transition-colors">
                <IconPhone size={13} color="#3b82f6" />
                +91 98765 43210
              </a>
              <a href="mailto:info@hammervalve.com" className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-blue-400 transition-colors">
                <IconMail size={13} color="#3b82f6" />
                info@hammervalve.com
              </a>
              <div className="flex items-center gap-2 text-[12px] text-slate-500">
                <IconMapPin size={13} color="#3b82f6" />
                GIDC Estate, Rajkot — 360002
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-medium mb-4">
              Products
            </h4>
            <div className="flex flex-col gap-2.5">
              {products.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="text-[12px] text-slate-600 hover:text-blue-400 transition-colors"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-medium mb-4">
              Company
            </h4>
            <div className="flex flex-col gap-2.5">
              {company.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="text-[12px] text-slate-600 hover:text-blue-400 transition-colors"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-medium mb-4">
              Contact
            </h4>
            <div className="flex flex-col gap-2.5">
              {contact.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="text-[12px] text-slate-600 hover:text-blue-400 transition-colors"
                >
                  {c.label}
                </Link>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-[13px] font-medium px-4 py-2.5 rounded-md transition-colors w-fit"
            >
              <IconBrandWhatsapp size={16} />
              WhatsApp us
            </a>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#060d1a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-[11px] text-slate-700">
            © 2025 Hammer Valve Industries Pvt. Ltd. All rights reserved.
          </span>
          <div className="flex gap-4">
            <Link href="/sitemap.xml" className="text-[11px] text-slate-700 hover:text-slate-500">
              Sitemap
            </Link>
            <Link href="/contact" className="text-[11px] text-slate-700 hover:text-slate-500">
              Privacy
            </Link>
          </div>
        </div>
      </div>

    </footer>
  )
}