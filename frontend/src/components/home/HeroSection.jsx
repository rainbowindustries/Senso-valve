'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  IconLayoutGrid,
  IconFileDownload,
  IconCircleCheck,
  IconShieldCheck,
} from '@tabler/icons-react'
import { useInView } from 'react-intersection-observer'

// ─── Data ──────────────────────────────────────────
const certifications = [
  'ISO 9001:2015',
  'API 6D',
  'CE Marked',
  'IBR Approved',
  'ATEX',
]

const stats = [
  { num: '500+',   label: 'Products' },
  { num: '25+',    label: 'Years of Excellence' },
  { num: '40+',    label: 'Countries Exported' },
  { num: '5000+',  label: 'Global Clients' },
]

const slides = [
  {
    url: 'https://www.sensovalves.com/img/background_2.jpeg',
    label: 'Precision Engineering',
  },
  {
    url: 'https://www.sensovalves.com/img/background_6.jpeg',
    label: 'Industrial Pipeline Systems',
  },
  {
    url: 'https://www.sensovalves.com/img/background_3.jpg',
    label: 'Advanced Manufacturing',
  },
  {
    url: 'https://www.sensovalves.com/img/background_4.jpeg',
    label: 'Advanced Manufacturing',
  },
  {
    url: 'https://www.sensovalves.com/img/background_5.jpeg',
    label: 'Advanced Manufacturing',
  },
]

// ─── Counter hook ──────────────────────────────────
function useCounter(target, duration = 1800, active = false) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!active) return
    const numTarget = parseInt(target.replace(/\D/g, ''), 10)
    if (!numTarget) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.floor(eased * numTarget))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])

  return val
}

// ─── Stat card ─────────────────────────────────────
function StatCard({ num, label, active }) {
  const suffix = num.replace(/[\d,]/g, '')
  const raw = useCounter(num, 1800, active)

  return (
    <div className="flex-1 min-w-[110px] text-center px-6 py-5 border-r border-white/10 last:border-r-0">
      <div className="text-[26px] font-semibold text-white leading-none mb-1 tracking-tight">
        {raw}{suffix}
      </div>
      <div className="text-[11px] text-white/50 uppercase tracking-widest font-normal">
        {label}
      </div>
    </div>
  )
}

// ─── Fade up on scroll ─────────────────────────────
function FadeUp({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                     transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Main ──────────────────────────────────────────
export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [prevSlide, setPrevSlide] = useState(null)
  const [heroVisible, setHeroVisible] = useState(false)
  const [statsActive, setStatsActive] = useState(false)
  const statsRef = useRef(null)
  const intervalRef = useRef(null)

  const DISPLAY_TIME   = 4100  // ms each slide stays fully visible
  const CROSSFADE_TIME = 1400  // ms for the crossfade transition
  // Total = 5500ms per slide cycle

  // Slideshow
  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setActiveSlide(current => {
          const next = (current + 1) % slides.length
          setPrevSlide(current)
          setTimeout(() => setPrevSlide(null), CROSSFADE_TIME)
          return next
        })
      }, DISPLAY_TIME + CROSSFADE_TIME)
    }
    startInterval()
    return () => clearInterval(intervalRef.current)
  }, [])

  // Hero entrance
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 150)
    return () => clearTimeout(t)
  }, [])

  // Stats counter trigger
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsActive(true) },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const goTo = (i) => {
    setActiveSlide(prev => {
      setPrevSlide(prev)
      setTimeout(() => setPrevSlide(null), CROSSFADE_TIME)
      return i
    })
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setActiveSlide(current => {
        const next = (current + 1) % slides.length
        setPrevSlide(current)
        setTimeout(() => setPrevSlide(null), CROSSFADE_TIME)
        return next
      })
    }, DISPLAY_TIME + CROSSFADE_TIME)
  }

  return (
    <section className="font-sans">

      {/* ── HERO ───────────────────────────────────── */}
      <div className="relative min-h-[100vh] flex flex-col overflow-hidden">

        {/* Outgoing slide — fades out smoothly after full display */}
        {prevSlide !== null && (
          <div
            key={`prev-${prevSlide}`}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${slides[prevSlide].url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              zIndex: 3,
              animation: `heroLeave ${CROSSFADE_TIME}ms cubic-bezier(0.4,0,0.6,1) forwards`,
            }}
          />
        )}

        {/* Active slide — already fully visible underneath the outgoing fade */}
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${slide.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              opacity: i === activeSlide ? 1 : 0,
              zIndex: i === activeSlide ? 2 : 0,
              animation: i === activeSlide ? 'heroEnter 5.5s cubic-bezier(0.22,1,0.36,1) forwards' : 'none',
            }}
          />
        ))}

        {/* Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0f1928]/85 via-[#0f1928]/65 to-[#0f1928]/30"
          style={{ zIndex: 3 }}
        />

        {/* Hero content */}
        <div
          className="relative flex-1 flex items-center px-8 md:px-16 lg:px-20 py-24 max-w-3xl"
          style={{
            zIndex: 4,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
              <IconShieldCheck size={13} color="#93C5FD" strokeWidth={1.5} />
              <span className="text-[11px] text-white/80 uppercase tracking-[1.8px] font-medium">
                ISO 9001:2015 Certified Manufacturer
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[clamp(36px,5vw,58px)] font-semibold text-white leading-[1.15] tracking-tight mb-5">
              WELLCOME TO<br />
              <span className="text-green-300">
                VERTEX VALVE
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-[16px] font-light text-white/70 leading-relaxed max-w-[480px] mb-9">
              Manufacturer & exporter of manual and automated valves for oil & gas,
              pharma, power and water treatment industries across 40+ countries.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#1a2e44] hover:bg-[#142438] text-white text-[14px] font-medium px-7 py-3.5 rounded-lg border border-[#1a2e44] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1a2e44]/40"
              >
                <IconLayoutGrid size={16} strokeWidth={1.5} />
                Explore Products
              </Link>
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/18 text-white text-[14px] font-normal px-7 py-3.5 rounded-lg border border-white/28 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/45"
              >
                <IconFileDownload size={16} strokeWidth={1.5} />
                Download Catalogue
              </Link>
            </div>

          </div>
        </div>

        {/* Stats bar — bottom of hero */}
        <div
          ref={statsRef}
          className="relative bg-[#0f1928]/88 backdrop-blur-md border-t border-white/10"
          style={{ zIndex: 4 }}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} active={statsActive} />
            ))}
          </div>
        </div>

      </div>

      {/* ── CERTIFICATION STRIP ─────────────────────── */}
      <div className="bg-white border-b border-slate-100 py-3 px-8 md:px-16">
        <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-3">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap">
            Certified by
          </span>
          <div className="w-px h-5 bg-slate-200 hidden sm:block" />
          <div className="flex flex-wrap gap-2">
            {certifications.map(cert => (
              <div
                key={cert}
                className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-[#1a2e44] rounded-md px-3 py-1.5 text-[12px] font-medium text-slate-600 transition-all cursor-default"
              >
                <IconCircleCheck size={13} color="#4A7FA5" strokeWidth={1.5} />
                {cert}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes heroEnter {
          0%   { opacity: 0; transform: scale(1.06); }
          8%   { opacity: 1; transform: scale(1.04); }
          85%  { opacity: 1; transform: scale(1.0);  }
          100% { opacity: 1; transform: scale(1.0);  }
        }
        @keyframes heroLeave {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

    </section>
  )
}