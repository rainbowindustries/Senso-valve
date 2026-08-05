'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  IconLayoutGrid,
  IconCircleCheck,
  IconShieldCheck,
  IconArrowRight,
} from '@tabler/icons-react'

// ─── Data ──────────────────────────────────────────
const certifications = [
  { name: 'ISO 9001:2015', standard: 'Quality Management' },
  { name: 'API 6D', standard: 'Pipeline Valve Standards' },
  { name: 'CE Marked', standard: 'European Conformity' },
  { name: 'IBR Approved', standard: 'Indian Boiler Regulations' },
  { name: 'ATEX', standard: 'Explosion Proof Rating' },
]

const stats = [
  { num: '500+', label: 'Products' },
  { num: '25+', label: 'Years' },
  { num: '40+', label: 'Countries' },
  { num: '5000+', label: 'Clients' },
]

// ─── Counter hook ──────────────────────────────────
function useCounter(target, duration = 2000, active = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    const end = parseInt(target.replace(/\D/g, ''), 10)
    if (!end) return
    let start = null
    const tick = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4)
      setVal(Math.floor(eased * end))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, active])
  return val
}

// ─── Stat Card ─────────────────────────────────────
function StatCard({ num, label, active, index }) {
  const suffix = num.replace(/[\d,]/g, '')
  const raw = useCounter(num, 2000, active)
  return (
    <div
      className="relative text-center py-6 sm:py-7 border-r border-white/[0.08] last:border-r-0 group hover:bg-white/[0.03] transition-all duration-500"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`,
      }}
    >
      <div className="text-[28px] sm:text-[34px] font-black text-[#EF8135] leading-none mb-1.5 tracking-tighter">
        {raw}{suffix}
      </div>
      <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-[3px] font-bold">
        {label}
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-10 h-[2px] bg-[#EF8135]/50 transition-all duration-500 rounded-full" />
    </div>
  )
}

// ─── Main Component ────────────────────────────────
export default function HeroSection() {
  const [photoLoaded, setPhotoLoaded] = useState(false)
  const [textReady, setTextReady] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)

  // Sequential Landing Sequence: Photo loads first, then text fades in
  useEffect(() => {
    // Stage 1: Load/Animate photo immediately on mount
    setPhotoLoaded(true)

    // Stage 2: Trigger text animation after photo finishes sliding in
    const t = setTimeout(() => {
      setTextReady(true)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  // Stats observer
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="font-sans antialiased overflow-hidden bg-white">

      {/* ─── Native CSS Keyframe Injection (Prevents styled-jsx compiler issues) ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.8deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translate3d(120px, 15px, 0) scale(0.9) rotate(3deg);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
          }
        }
        .animate-slide-in-right {
          opacity: 0;
          animation: slideInFromRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes revealUp {
          from { clip-path: inset(100% 0 0 0); opacity: 0; transform: translateY(20px); }
          to { clip-path: inset(0 0 0 0); opacity: 1; transform: translateY(0); }
        }
        .animate-reveal-up {
          opacity: 0;
          animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 32s linear infinite;
        }
      ` }} />

      {/* ─── HERO CONTENT ─── */}
      <div className="relative min-h-[82vh] lg:min-h-[88vh] flex flex-col justify-between pt-10">
        
        {/* Ambient background graphics */}
        <div className="absolute right-0 top-0 w-[550px] h-[550px] bg-[#0A8F8A]/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-[-100px] bottom-0 w-[450px] h-[450px] bg-[#EF8135]/[0.01] rounded-full blur-3xl pointer-events-none" />

        {/* Main Grid Content */}
        <div className="flex-1 max-w-[1280px] w-full mx-auto px-6 sm:px-8 lg:px-10 flex items-center py-10 lg:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
            
            {/* Left Side: Staggered Content (6 columns - exactly half) */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              
              {/* Tagline Badge */}
              <div
                className="flex items-center gap-2"
                style={{
                  opacity: textReady ? 1 : 0,
                  transform: textReady ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 100ms',
                }}
              >
                <div className="w-5 h-0.5 bg-[#EF8135] rounded-full" />
                <span className="text-[11px] font-bold text-[#EF8135] uppercase tracking-[2.5px]">
                  Precision Engineered Valves
                </span>
              </div>

              {/* Headline */}
              <div className={textReady ? 'animate-reveal-up' : 'opacity-0'} style={{ animationDelay: '200ms' }}>
                <h1 className="text-[40px] sm:text-[50px] lg:text-[54px] font-black leading-[1.08] tracking-tight mb-2 text-slate-900">
                  Reliable Flow Control Solutions For Every Industry
                </h1>
              </div>

              {/* Subtext */}
              <div className={textReady ? 'animate-reveal-up' : 'opacity-0'} style={{ animationDelay: '350ms' }}>
                <p className="text-[14.5px] sm:text-[16px] text-slate-500 leading-[1.7] max-w-lg mb-4 font-normal">
                  Vertex Valve manufactures and exports high-performance industrial valves designed for demanding applications across Oil & Gas, Chemical, Power, and Water Treatment processes.
                </p>
              </div>

              {/* CTA row */}
              <div className={textReady ? 'animate-reveal-up' : 'opacity-0'} style={{ animationDelay: '500ms' }}>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/products"
                    className="group inline-flex items-center gap-2 bg-[#0A8F8A] hover:bg-[#087C77] text-white text-[13.5px] font-bold px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <IconLayoutGrid size={15} strokeWidth={2.5} />
                    Explore Products
                    <IconArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-[#1E4356] hover:bg-[#15303E] text-white text-[13.5px] font-bold px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side: Layered Background and Floating Valve Photo (6 columns - exactly half) */}
            <div className="lg:col-span-6 flex justify-center items-center relative py-12">
              
              {/* Layer 1: Ambient Base Glow */}
              <div className="absolute w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] bg-[#0A8F8A]/5 rounded-full blur-3xl opacity-60 z-0 pointer-events-none" />

              {/* Layer 2: concentric border rotating circle */}
              <div 
                className="w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] lg:w-[540px] lg:h-[540px] border border-[#0A8F8A]/15 rounded-full absolute z-0 pointer-events-none animate-spin-slow"
                style={{
                  opacity: photoLoaded ? 1 : 0,
                  transform: photoLoaded ? 'scale(1)' : 'scale(0.8)',
                  transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />

              {/* Layer 3: solid background gradient canvas */}
              <div 
                className="w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[480px] lg:h-[480px] bg-gradient-to-tr from-[#EBF5F4] to-[#0A8F8A]/10 rounded-full absolute z-0 pointer-events-none shadow-[inset_0_4px_12px_rgba(10,143,138,0.05)]" 
                style={{
                  opacity: photoLoaded ? 1 : 0,
                  transform: photoLoaded ? 'scale(1)' : 'scale(0.75)',
                  transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 100ms',
                }}
              />

              {/* Layer 4: Floating Valve Image with slide entrance */}
              <div className={`relative z-10 w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[460px] ${photoLoaded ? 'animate-slide-in-right' : 'opacity-0'}`}>
                <div className="animate-float">
                  <img
                    src="https://sensovalves.com/wp-content/uploads/2026/07/ChatGPT-Image-Jul-16-2026-12_19_28-AM-825x825.webp"
                    alt="Precision Ball Valve Render"
                    className="w-full h-auto object-contain transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ─── STATS TICKER (Contrast Dark Panel) ─── */}
        <div
          ref={statsRef}
          className="bg-[#1E4356] border-t border-white/[0.05]"
        >
          <div className="max-w-[1280px] mx-auto grid grid-cols-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} active={statsVisible} index={i} />
            ))}
          </div>
        </div>

      </div>

      {/* ─── CERTIFICATION STRIP (Upgraded Premium Cards) ─── */}
      <div className="bg-[#FAFAF8] border-b border-[#E5E2DC] py-8 px-6 sm:px-10 lg:px-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            
            {/* Title / Badge */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0A8F8A]/10 flex items-center justify-center">
                <IconShieldCheck size={18} className="text-[#0A8F8A]" strokeWidth={2} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[2.5px] block leading-none mb-1">
                  Certifications
                </span>
                <span className="text-[13px] font-bold text-slate-800 leading-none">
                  Global Quality Standards
                </span>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              {certifications.map((cert, i) => (
                <div
                  key={cert.name}
                  title={cert.standard}
                  className="flex items-center gap-2 bg-white border border-[#E5E2DC] rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md hover:border-[#0A8F8A]/35 hover:bg-[#EBF5F4]/40 hover:-translate-y-0.5 transition-all duration-300 cursor-default group"
                  style={{
                    opacity: textReady ? 1 : 0,
                    transform: textReady ? 'translateY(0)' : 'translateY(10px)',
                    transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 80 + 200}ms`,
                  }}
                >
                  <IconCircleCheck size={15} className="text-[#0A8F8A] group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                  <div>
                    <span className="text-[12px] font-bold text-slate-700 block leading-tight">{cert.name}</span>
                    <span className="text-[9px] text-slate-400 font-medium hidden sm:block leading-none">{cert.standard}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
