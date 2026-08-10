'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconMenu2,
  IconX,
  IconChevronDown,
  IconFileTypePdf,
  IconSearch,
  IconPackage,
} from '@tabler/icons-react'
import Image from 'next/image'
import { API_URL } from '@/lib/api'

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
    fetch(`${API_URL}/certificates`)
      .then(r => r.json())
      .then(d => setCertificates(d.data || []))
      .catch(err => console.error('Failed to fetch navbar certificates:', err))
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(r => r.json())
      .then(d => setAllProducts(d.data || []))
      .catch(err => console.error('Failed to fetch navbar products for search:', err))
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
      p?.name && p.name.toLowerCase().includes(q)
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

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchOpen(false)
      router.push(`/products?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header
      style={{
        textRendering: 'optimizeLegibility',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
      className={`sticky top-0 z-50 transition-all duration-350 antialiased ${scrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E2DC] shadow-[0_8px_30px_rgba(10,143,138,0.03)]'
        : 'bg-white border-b border-transparent'
        }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 h-[74px] sm:h-[80px] flex items-center justify-between gap-3 sm:gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0 transition-opacity duration-300 hover:opacity-95">
          <Image
            src="/Logo (2).png"
            alt="Vertex Valve - Industrial Valve Manufacturer Logo"
            width={150}
            height={65}
            className="h-[75px] md:h-[80px] "
            priority
          />
        </Link>


        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2">
          {navLinks.map(link => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-2 text-[14.5px] md:text-[15px] font-semibold tracking-tight no-underline group"
              >
                <span
                  className={`relative z-10 transition-colors duration-200 ${active ? 'text-[#0A8F8A] font-bold' : 'text-slate-700 group-hover:text-[#0A8F8A]'
                    }`}
                >
                  {link.label}
                </span>
                <span
                  className={`absolute left-3.5 right-3.5 bottom-1 h-[2.5px] rounded-full bg-[#0A8F8A] origin-left transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                />
              </Link>
            )
          })}

          {/* Certificates dropdown */}
          <div className="relative" onMouseEnter={openCert} onMouseLeave={closeCert}>
            <button className="flex items-center gap-1.5 px-3.5 py-2 text-[14.5px] md:text-[15px] font-semibold tracking-tight text-slate-700 hover:text-[#0A8F8A] bg-transparent border-none cursor-pointer transition-colors duration-200">
              Certificates
              <IconChevronDown
                size={14}
                strokeWidth={2.5}
                className={`transition-transform duration-300 ${certOpen ? 'rotate-180 text-[#0A8F8A]' : ''}`}
              />
            </button>

            <div
              onMouseEnter={openCert}
              onMouseLeave={closeCert}
              className={`absolute top-[calc(100%+12px)] right-0 w-64 bg-white border border-[#E5E2DC] rounded-2xl shadow-[0_20px_50px_rgba(10,143,138,0.06)] z-[60] overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] origin-top-right ${certOpen
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 -translate-y-2 scale-[0.97] pointer-events-none'
                }`}
            >
              <div className="px-4 py-3 bg-[#FAFAF8] border-b border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase tracking-[2px] font-bold block">
                  Download Certificates
                </span>
              </div>
              <div className="py-1.5 max-h-72 overflow-y-auto">
                {certificates.length === 0 ? (
                  <p className="text-[13px] text-slate-400 px-4 py-3 italic">No certificates uploaded yet</p>
                ) : (
                  certificates.map(cert => (
                    <a
                      key={cert.id}
                      href={cert.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 no-underline text-slate-700 hover:bg-[#EBF5F4]/60 hover:text-[#0A8F8A] transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                        <IconFileTypePdf size={16} color="#ef4444" strokeWidth={1.5} />
                      </div>
                      <span className="text-[13.5px] font-bold leading-snug">{cert.name}</span>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Right Actions Block (Search & Mobile Navigation) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">

          {/* Search Button / Input */}
          <div ref={searchBoxRef} className="relative">
            {!searchOpen ? (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer text-slate-600 hover:text-[#0A8F8A] hover:bg-slate-100 transition-all duration-200 bg-transparent border-none flex-shrink-0"
                aria-label="Search products"
              >
                <IconSearch size={19} strokeWidth={2} />
              </button>
            ) : (
              <div className="fixed sm:absolute left-0 sm:left-auto right-0 top-[74px] sm:top-0 sm:right-0 sm:relative flex items-center bg-[#FAFAF8] border border-[#E5E2DC] sm:rounded-xl px-3 h-12 sm:h-10 w-screen sm:w-[280px] z-50 border-x-0 sm:border-x">
                <IconSearch size={17} className="text-[#0A8F8A] flex-shrink-0" strokeWidth={2.2} />
                <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center min-w-0">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-transparent border-none outline-none text-[13.5px] text-slate-800 placeholder-slate-400 px-2 font-semibold"
                  />
                </form>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                >
                  <IconX size={17} strokeWidth={2} />
                </button>
              </div>
            )}

            {/* Search Results Dropdown */}
            {searchOpen && query.trim() && (
              <div className="fixed sm:absolute left-0 sm:left-auto right-0 top-[122px] sm:top-[calc(100%+10px)] sm:right-0 w-screen sm:w-[320px] bg-white border-y sm:border border-[#E5E2DC] sm:rounded-2xl shadow-[0_16px_48px_rgba(10,143,138,0.08)] z-[60] overflow-hidden max-h-[360px] overflow-y-auto">
                {results.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-[13.5px] text-slate-400">
                      No products found for "<span className="text-slate-600 font-bold">{query}</span>"
                    </p>
                  </div>
                ) : (
                  <div className="py-1.5">
                    {results.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => goToProduct(p.slug)}
                        className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-[#EBF5F4]/60 text-slate-700 hover:text-[#0A8F8A] transition-all duration-200 text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {p.images && p.images.length > 0 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <IconPackage size={15} className="text-slate-350" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13.5px] font-bold truncate">
                            {p.name}
                          </div>
                          {p.categories?.name && (
                            <div className="text-[11.5px] text-slate-400 font-medium truncate">
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

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer text-slate-600 hover:text-[#0A8F8A] hover:bg-slate-100 transition-colors duration-150 bg-transparent border-none flex-shrink-0"
            aria-label="Toggle menu"
          >
            {menuOpen ? <IconX size={22} strokeWidth={2} /> : <IconMenu2 size={22} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
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
                className={`px-4 py-3 rounded-xl text-[14.5px] sm:text-[15px] no-underline transition-all duration-200 ${active
                  ? 'font-bold text-[#0A8F8A] bg-[#EBF5F4]'
                  : 'font-semibold text-slate-600 hover:bg-[#FAFAF8] hover:text-slate-900'
                  }`}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Collapsible Mobile Certificates Accordion */}
          <div className="mt-1 border-t border-slate-100 pt-1">
            <button
              onClick={() => setMobileCertOpen(o => !o)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-[14.5px] sm:text-[15px] font-semibold text-slate-600 hover:bg-[#FAFAF8] hover:text-slate-900 transition-all duration-150"
            >
              Certificates
              <IconChevronDown
                size={16}
                strokeWidth={2.5}
                className={`transition-transform duration-200 ${mobileCertOpen ? 'rotate-180 text-[#0A8F8A]' : ''}`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileCertOpen ? 'max-h-[300px]' : 'max-h-0'
                }`}
            >
              {certificates.length === 0 ? (
                <p className="text-[13px] text-slate-400 px-4 py-2 italic">No certificates uploaded yet</p>
              ) : (
                certificates.map(cert => (
                  <a
                    key={cert.id}
                    href={cert.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-4 py-3 pl-7 rounded-xl no-underline text-slate-700 hover:bg-[#EBF5F4]/40 hover:text-[#0A8F8A] transition-all duration-200"
                  >
                    <IconFileTypePdf size={14} color="#ef4444" strokeWidth={1.5} />
                    <span className="text-[13.5px] font-bold">{cert.name}</span>
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