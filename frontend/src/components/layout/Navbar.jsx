'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  IconSettings2,
  IconPhone,
  IconMenu2,
  IconX,
  IconChevronDown,
  IconFileTypePdf,
} from '@tabler/icons-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Catalogue', href: '/catalogue' },
  { label: 'Applications', href: '/application' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [certOpen, setCertOpen] = useState(false)
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificates`
      )
      const data = await res.json()
      setCertificates(data.data || [])
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
    }
  }

  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
            <IconSettings2 size={18} color="#60a5fa" />
          </div>
          <div>
            <div className="text-[15px] font-medium text-slate-900 leading-tight">
              Hammer Valve
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">
              Industries · Est. 2001
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-slate-500 hover:text-[#1e3a5f] transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Certificates Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCertOpen(true)}
            onMouseLeave={() => setTimeout(() => setCertOpen(false),10000)}
          >
            <button
              className="flex items-center gap-1 text-[13px] text-slate-500 hover:text-[#1e3a5f] transition-colors"
            >
              Certificates
              <IconChevronDown
                size={14}
                className={`transition-transform duration-200 ${certOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown */}
            {certOpen && (
              <div className="absolute top-7 left-0 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/60 py-2 w-56 z-50">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest px-4 py-2 font-medium">
                  Download certificates
                </p>

                {certificates.length === 0 ? (
                  <p className="text-[12px] text-slate-400 px-4 py-2">
                    No certificates yet
                  </p>
                ) : (
                  certificates.map((cert) => (
                    <a
                      key={cert.id}
                      href={cert.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                    >
                      <IconFileTypePdf
                        size={15}
                        className="text-red-400 flex-shrink-0"
                      />
                      <span className="text-[13px] text-slate-600">
                        {cert.name}
                      </span>
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:+919876543210"
            className="flex items-center gap-1.5 text-[12px] text-slate-500 pr-4 border-r border-slate-200"
          >
            <IconPhone size={13} color="#3b82f6" />
            +91 98765 43210
          </a>
          <a
            href="/contact"
            className="bg-[#1e3a5f] text-white text-[13px] font-medium px-5 py-2 rounded-md hover:bg-[#162d4a] transition-colors"
          >
            Get a quote
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-slate-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] text-slate-600 hover:text-[#1e3a5f]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}

          {/* Mobile Certificates */}
          <div className="border-t border-slate-100 pt-3">
            <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-2 font-medium">
              Certificates
            </p>
            {certificates.length === 0 ? (
              <p className="text-[12px] text-slate-400">No certificates yet</p>
            ) : (
              certificates.map((cert) => (
                <a
                  key={cert.id}
                  href={cert.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-2 text-[13px] text-slate-600"
                >
                  <IconFileTypePdf size={14} className="text-red-400" />
                  {cert.name}
                </a>
              ))
            )}
          </div>

          <Link
            href="/contact"
            className="bg-[#1e3a5f] text-white text-[13px] font-medium px-5 py-2.5 rounded-md text-center mt-2"
            onClick={() => setMenuOpen(false)}
          >
            Get a quote
          </Link>
        </div>
      )}
    </header>
  )
}