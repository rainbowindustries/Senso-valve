'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IconArrowRight, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useInView } from 'react-intersection-observer'

// ─── Valve SVG placeholder ─────────────────────────
function ValvePlaceholder({ automated }) {
  const primary = automated ? '#1a2e44' : '#1a2e44'
  const light = automated ? '#e8f0f7' : '#f0f4f8'
  return (
    <svg width="90" height="90" viewBox="0 0 96 96" fill="none">
      <rect x="28" y="40" width="40" height="20" rx="5" fill={light} stroke={primary} strokeWidth="1.5" />
      <rect x="44" y="18" width="8" height="24" rx="3" fill={light} stroke={primary} strokeWidth="1.5" />
      <circle cx="48" cy="16" r="11" fill="none" stroke={primary} strokeWidth="1.8" />
      <line x1="37" y1="16" x2="59" y2="16" stroke={primary} strokeWidth="1.5" />
      <line x1="48" y1="5" x2="48" y2="27" stroke={primary} strokeWidth="1.5" />
      <rect x="4" y="45" width="25" height="10" rx="3" fill={light} stroke={primary} strokeWidth="1.2" />
      <rect x="67" y="45" width="25" height="10" rx="3" fill={light} stroke={primary} strokeWidth="1.2" />
      {automated && (
        <>
          <rect x="36" y="4" width="24" height="14" rx="4" fill="#DBEAFE" stroke="#4A7FA5" strokeWidth="1.2" />
          <rect x="44" y="1" width="8" height="5" rx="2" fill="#93C5FD" />
        </>
      )}
      <circle cx="48" cy="50" r="7" fill={primary} fillOpacity=".12" stroke={primary} strokeWidth="1.2" />
      <circle cx="48" cy="50" r="3" fill={primary} fillOpacity=".4" />
    </svg>
  )
}

// ─── FadeUp ────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                     transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Product Card ──────────────────────────────────
function ProductCard({ product, delay }) {
  const isAuto = (product.categories?.name || '').toLowerCase().includes('auto')

  return (
    <FadeUp delay={delay}>
      <Link href={`/products/${product.slug}`} className="block group">
        <div className="bg-white border border-slate-300 hover:border-slate-300 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/80 cursor-pointer">

          {/* Image area — pure white with light border bottom */}
          <div className="relative h-56 bg-white overflow-hidden flex items-center justify-center border-b border-slate-100">

            {/* Type badge — dark navy pill, top-left */}
            {/* <span
              className="absolute top-3 left-3 z-10 text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-md"
              style={{ background: '#14539c', color: '#fff' }}
            >
              {isAuto ? 'Automated' : 'Manual'}
            </span> */}

            {/* Product image or placeholder */}
            {product.images && product.images.length > 0 ? (
              <div className="relative w-full h-full group-hover:scale-[1.05] transition-transform duration-500">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                />
              </div>
            ) : (
              <div className="group-hover:scale-105 transition-transform duration-500">
                <ValvePlaceholder automated={isAuto} />
              </div>
            )}
          </div>

          {/* Footer: name + arrow */}
          <div className="px-5 py-4 flex items-center justify-between gap-3">
            <h3 className="text-[15px] font-semibold text-slate-800 group-hover:text-[#1a2e44] transition-colors leading-snug">
              {product.name}
            </h3>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-slate-200 group-hover:border-[#1a2e44] group-hover:bg-[#1a2e44] transition-all duration-200"
            >
              <IconArrowRight
                size={14}
                className="text-slate-400 group-hover:text-white transition-colors group-hover:translate-x-0.5 duration-200"
              />
            </div>
          </div>

        </div>
      </Link>
    </FadeUp>
  )
}

// ─── Main ──────────────────────────────────────────
export default function FeaturedProducts({ products = [] }) {
  const scrollRef = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const updateArrows = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 10)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows)
    updateArrows()
    return () => el.removeEventListener('scroll', updateArrows)
  }, [products])

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  if (products.length === 0) {
    return (
      <section className="py-20 px-8 bg-white text-center">
        <p className="text-[14px] text-slate-400">No featured products yet.</p>
      </section>
    )
  }

  return (
    <section className="bg-white py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <FadeUp delay={0}>
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-0.5 rounded-full" style={{ background: '#1a2e44' }} />
                <span className="text-[11px] font-semibold uppercase tracking-[2px]" style={{ color: '#1a2e44' }}>
                  Product Range
                </span>
              </div>
              <h2 className="text-[clamp(26px,4vw,36px)] font-bold text-slate-900 tracking-tight leading-tight mb-2">
                Our Valve Categories
              </h2>
              <p className="text-[14px] text-slate-500 max-w-md leading-relaxed">
                Comprehensive range of manual and automated valves manufactured to international standards.
              </p>
            </div>

            {/* Nav arrows + View all */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll(-1)}
                disabled={!canLeft}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
                  canLeft
                    ? 'bg-white border-slate-200 text-slate-600 hover:border-[#1a2e44] hover:text-[#1a2e44]'
                    : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                <IconChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => scroll(1)}
                disabled={!canRight}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
                  canRight
                    ? 'bg-white border-slate-200 text-slate-600 hover:border-[#1a2e44] hover:text-[#1a2e44]'
                    : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                <IconChevronRight size={16} strokeWidth={1.5} />
              </button>
              <Link
                href="/products"
                className="flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-lg border transition-all ml-1"
                style={{ color: '#fff', background: '#1a2e44', borderColor: '#1a2e44' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#253d57' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1a2e44' }}
              >
                View all
                <IconArrowRight size={13} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </FadeUp>

        {/* Horizontal scroll */}
        <div className="relative">
          {canLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          )}
          {canRight && (
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          )}

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, i) => (
              <div key={product.id} className="flex-shrink-0" style={{ width: '300px' }}>
                <ProductCard product={product} delay={i * 60} />
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx global>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}