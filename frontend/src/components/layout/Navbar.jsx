'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconSettings2,
  IconMenu2,
  IconX,
  IconChevronDown,
  IconFileTypePdf,
  IconSearch,
  IconPackage,
} from '@tabler/icons-react'
import Image from 'next/image'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Applications', href: '/application' },
  { label: 'Catalogue', href: '/catalogue' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [certOpen, setCertOpen] = useState(false)
  const [mobileCertOpen, setMobileCertOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [certificates, setCertificates] = useState([])
  const timeoutRef = useRef(null)

  // ── Search state ──
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [allProducts, setAllProducts] = useState([])
  const [results, setResults] = useState([])
  const searchInputRef = useRef(null)
  const searchBoxRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/certificates`)
      .then(r => r.json())
      .then(d => setCertificates(d.data || []))
      .catch(() => { })
  }, [])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then(r => r.json())
      .then(d => setAllProducts(d.data || []))
      .catch(() => { })
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setMobileCertOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const q = query.trim().toLowerCase()
    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(q)
    ).slice(0, 8)
    setResults(filtered)
  }, [query, allProducts])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [searchOpen])

  useEffect(() => {
    const handleClick = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    if (searchOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [searchOpen])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const openCert = () => { clearTimeout(timeoutRef.current); setCertOpen(true) }
  const closeCert = () => { timeoutRef.current = setTimeout(() => setCertOpen(false), 160) }

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const goToProduct = (slug) => {
    setSearchOpen(false)
    router.push(`/products/${slug}`)
  }

  return (
    <header
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? 'border-b border-slate-200 shadow-[0_4px_24px_rgba(15,23,42,0.06)]'
          : 'border-b border-transparent'
        }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-10 h-[70px] sm:h-[76px] flex items-center justify-between gap-3 sm:gap-6">

        {/* Logo */}
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/Vertex_Valve_logo.png"   // or your logo URL
            alt="Company Logo"
            width={180}
            height={60}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-2 text-[13.5px] font-medium no-underline group"
              >
                <span
                  className={`relative z-10 transition-colors duration-200 ${active ? 'text-slate-900 font-semibold' : 'text-slate-500 group-hover:text-slate-900'
                    }`}
                >
                  {link.label}
                </span>
                <span
                  className={`absolute left-3.5 right-3.5 bottom-1.5 h-[2px] rounded-full bg-[#1a2e44] origin-left transition-transform duration-200 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                />
              </Link>
            )
          })}

          {/* Certificates dropdown — desktop only */}
          <div className="relative" onMouseEnter={openCert} onMouseLeave={closeCert}>
            <button className="flex items-center gap-1 px-3.5 py-2 text-[13.5px] font-medium text-slate-500 hover:text-slate-900 bg-transparent border-none cursor-pointer transition-colors duration-200">
              Certificates
              <IconChevronDown
                size={13}
                strokeWidth={2}
                className={`transition-transform duration-200 ${certOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <div
              onMouseEnter={openCert}
              onMouseLeave={closeCert}
              className={`absolute top-[calc(100%+12px)] right-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-[0_16px_48px_rgba(15,23,42,0.12)] z-[60] overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] origin-top-right ${certOpen
                  ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                  : 'opacity-0 -translate-y-2 scale-[0.97] pointer-events-none'
                }`}
            >
              <div className="px-4 py-3 border-b border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase tracking-[1.5px] font-bold">
                  Download Certificates
                </span>
              </div>
              <div className="py-1.5 max-h-72 overflow-y-auto">
                {certificates.length === 0 ? (
                  <p className="text-[13px] text-slate-400 px-4 py-3">No certificates uploaded yet</p>
                ) : (
                  certificates.map(cert => (
                    <a
                      key={cert.id}
                      href={cert.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2.5 no-underline hover:bg-slate-50 transition-colors duration-150"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                        <IconFileTypePdf size={15} color="#ef4444" strokeWidth={1.5} />
                      </div>
                      <span className="text-[13px] text-slate-700 font-medium leading-snug">{cert.name}</span>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Right side — search + mobile toggle */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

          {/* Search */}
          <div ref={searchBoxRef} className="relative">
            {!searchOpen ? (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center cursor-pointer text-slate-600 hover:bg-slate-100 transition-colors duration-150 bg-transparent border-none flex-shrink-0"
                aria-label="Search products"
              >
                <IconSearch size={18} strokeWidth={1.8} />
              </button>
            ) : (
              <div className="fixed sm:absolute left-0 sm:left-auto right-0 top-[70px] sm:top-0 sm:right-0 sm:relative flex items-center bg-slate-50 border border-slate-200 sm:rounded-xl px-3 h-12 sm:h-10 w-screen sm:w-[280px] z-50 border-x-0 sm:border-x">
                <IconSearch size={16} className="text-slate-400 flex-shrink-0" strokeWidth={1.8} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-[13.5px] text-slate-900 placeholder-slate-400 px-2"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                >
                  <IconX size={16} strokeWidth={1.8} />
                </button>
              </div>
            )}

            {/* Results dropdown */}
            {searchOpen && query.trim() && (
              <div className="fixed sm:absolute left-0 sm:left-auto right-0 top-[122px] sm:top-[calc(100%+10px)] sm:right-0 w-screen sm:w-[320px] bg-white border-y sm:border border-slate-200 sm:rounded-2xl shadow-[0_16px_48px_rgba(15,23,42,0.14)] z-[60] overflow-hidden max-h-[360px] overflow-y-auto">
                {results.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-[13px] text-slate-400">
                      No products found for "<span className="text-slate-600 font-medium">{query}</span>"
                    </p>
                  </div>
                ) : (
                  <div className="py-1.5">
                    {results.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => goToProduct(p.slug)}
                        className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-slate-50 transition-colors duration-150 text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {p.images && p.images.length > 0 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <IconPackage size={15} className="text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-medium text-slate-900 truncate">
                            {p.name}
                          </div>
                          {p.categories?.name && (
                            <div className="text-[11px] text-slate-400 truncate">
                              {p.categories.name}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(o => !o)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center cursor-pointer text-slate-600 hover:bg-slate-100 transition-colors duration-150 bg-transparent border-none flex-shrink-0"
            aria-label="Toggle menu"
          >
            {menuOpen ? <IconX size={20} strokeWidth={1.6} /> : <IconMenu2 size={20} strokeWidth={1.6} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden bg-white border-t border-slate-100 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${menuOpen ? 'max-h-[600px] py-4 px-4 sm:px-5' : 'max-h-0 px-4 sm:px-5'
          }`}
      >
        <div className="flex flex-col gap-1">
          {navLinks.map(link => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-[14.5px] no-underline transition-colors duration-150 ${active
                    ? 'font-semibold text-slate-900 bg-slate-50'
                    : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Certificates — collapsible accordion on mobile */}
          <div className="mt-1 border-t border-slate-100 pt-1">
            <button
              onClick={() => setMobileCertOpen(o => !o)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-[14.5px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-150"
            >
              Certificates
              <IconChevronDown
                size={16}
                strokeWidth={2}
                className={`transition-transform duration-200 ${mobileCertOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileCertOpen ? 'max-h-[300px]' : 'max-h-0'
                }`}
            >
              {certificates.length === 0 ? (
                <p className="text-[13px] text-slate-400 px-4 py-2">No certificates uploaded yet</p>
              ) : (
                certificates.map(cert => (
                  <a
                    key={cert.id}
                    href={cert.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 pl-7 rounded-xl no-underline hover:bg-slate-50 transition-colors duration-150"
                  >
                    <IconFileTypePdf size={14} color="#ef4444" strokeWidth={1.5} />
                    <span className="text-[14px] text-slate-700 font-medium">{cert.name}</span>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}