'use client'
import { useState, useEffect, useRef } from 'react'
import {
  IconFlame, IconPill, IconDroplet, IconBolt,
  IconBuildingFactory, IconAnchor,
} from '@tabler/icons-react'

const industries = [
  { num: '01', icon: IconFlame, name: 'Oil & Gas', desc: 'Upstream, midstream and downstream pipeline systems demanding zero-leak precision.' },
  { num: '02', icon: IconPill, name: 'Pharmaceutical', desc: 'Hygienic valves engineered for sterile process environments and FDA compliance.' },
  { num: '03', icon: IconDroplet, name: 'Water Treatment', desc: 'Municipal and industrial water distribution networks built for continuous duty.' },
  { num: '04', icon: IconBolt, name: 'Power Plants', desc: 'High-pressure steam and turbine control systems for critical energy infrastructure.' },
  { num: '06', icon: IconAnchor, name: 'Marine', desc: 'Seawater and ballast system valve solutions certified for offshore environments.' },
  { num: '05', icon: IconBuildingFactory, name: 'Chemical', desc: 'Corrosion-resistant valve solutions for aggressive media across process industries.' },
]

// ── Client logos (Keeping natural colors) ───────────
const clients = [
  { name: 'Reliance Industries', src: '/download (2).png' },
  { name: 'Adani Group', src: '/download (3).png' },
  { name: 'Tata Projects', src: '/download (4).png' },
  { name: 'GAIL India', src: '/download (5).png' },
  { name: 'Hammer Valve', src: '/HammerValveLogo.webp' },
  { name: 'Essar Oil', src: null },
  { name: 'Bharat Petroleum', src: null },
  { name: 'Hindustan Zinc', src: null },
  { name: 'Vedanta', src: null },
  { name: 'NTPC', src: null },
]

// ── Industry Card Component (Light Theme Hover) ────
function IndustryCard({ ind, delay, visible }) {
  const Icon = ind.icon

  return (
    <div
      className="h-full"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      <div className="group relative h-full rounded-2xl overflow-hidden cursor-default border border-[#E5E2DC] bg-[#FAFAF8] p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:bg-gradient-to-br hover:from-white hover:to-[#EBF5F4] hover:border-[#0A8F8A]/35 hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_16px_32px_rgba(10,143,138,0.12)]">
        
        <div className="absolute top-0 left-0 w-full h-[3.5px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-[#14B2AC] group-hover:to-[#EF8135] transition-all duration-[800ms] z-10" />

        <span className="absolute top-3 right-4 text-[56px] font-black leading-none select-none pointer-events-none text-[#0A8F8A]/[0.04] transition-all duration-[800ms] ease-[cubic-bezier(0.16, 1, 0.3, 1)] group-hover:text-[#0A8F8A]/[0.08] group-hover:scale-110 group-hover:translate-y-1">
          {ind.num}
        </span>

        <div className="flex flex-col gap-4 flex-1">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#EEF2F7] border border-[#C8D4E0] transition-all duration-[800ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:bg-[#0A8F8A]/10 group-hover:border-[#0A8F8A]/30 group-hover:scale-115 group-hover:rotate-[8deg] group-hover:shadow-[0_0_15px_rgba(10,143,138,0.15)]">
            <Icon 
              size={20} 
              strokeWidth={1.8} 
              className="text-[#4A7FA5] transition-all duration-[600ms] transform group-hover:text-[#0A8F8A] group-hover:scale-[1.05]" 
            />
          </div>

          <div>
            <h3 className="text-[14.5px] font-bold mb-1.5 leading-snug tracking-tight text-slate-900 transition-colors duration-[500ms] group-hover:text-[#0A8F8A]">
              {ind.name}
            </h3>
            <p className="text-[12.5px] leading-relaxed m-0 text-slate-500 transition-colors duration-[500ms] group-hover:text-slate-600">
              {ind.desc}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between transition-colors duration-[600ms] group-hover:border-[#0A8F8A]/15">
          <span className="text-[10.5px] font-semibold uppercase tracking-widest text-[#94A3B8] transition-colors duration-[500ms] group-hover:text-[#EF8135]">
            {ind.num} / 06
          </span>
          <span className="opacity-0 -translate-x-2 text-[#EF8135] flex items-center transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-x-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Client Logo Card Component (Colors Intact) ───────
function ClientLogo({ client }) {
  if (client.src) {
    return (
      <div className="group flex items-center justify-center bg-white border border-[#E5E2DC] rounded-2xl h-[70px] sm:h-[80px] px-6 sm:px-8 mx-3 sm:mx-4 flex-shrink-0 hover:border-[#0A8F8A]/35 hover:shadow-md transition-all duration-300">
        <img
          src={client.src}
          alt={client.name}
          className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    )
  }
  return (
    <div className="group flex items-center gap-3 bg-white border border-[#E5E2DC] rounded-2xl h-[70px] sm:h-[80px] px-6 sm:px-8 mx-3 sm:mx-4 flex-shrink-0 hover:border-[#0A8F8A]/35 hover:shadow-md transition-all duration-300">
      <div className="w-8 h-8 rounded-lg bg-[#0A8F8A]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
        <span className="text-[12px] font-black text-[#0A8F8A] uppercase">
          {client.name.charAt(0)}
        </span>
      </div>
      <span className="text-[14px] sm:text-[15.5px] font-extrabold text-slate-900 whitespace-nowrap tracking-tight">
        {client.name}
      </span>
    </div>
  )
}

// ── Main Component ──────────────────────────────────
export default function IndustriesServed() {
  const [visible, setVisible] = useState(false)
  const [headerVis, setHeaderVis] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          setHeaderVis(true)
        }
      },
      { threshold: 0.08 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const track = [...clients, ...clients, ...clients]

  return (
    <>
      {/* ── INDUSTRIES GRID ───────────────────────── */}
      <section
        ref={sectionRef}
        className="bg-white border-t border-slate-100 py-14 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-10"
      >
        <div className="max-w-[1280px] mx-auto">

          {/* Header */}
          <div
            className="mb-8 sm:mb-10 lg:mb-12 flex flex-col items-center text-center"
            style={{
              opacity: headerVis ? 1 : 0,
              transform: headerVis ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-0.5 bg-[#0A8F8A] rounded-full" />
              <span className="text-[10.5px] font-semibold text-[#0A8F8A] uppercase tracking-[2px]">
                Applications
              </span>
              <div className="w-5 h-0.5 bg-[#0A8F8A] rounded-full" />
            </div>
            <h2 className="text-[clamp(22px,3vw,32px)] font-bold text-slate-900 leading-tight tracking-tight mb-2">
              Industries We Serve
            </h2>
            <p className="text-[13.5px] text-slate-500 leading-relaxed max-w-md mx-auto">
              Critical fluid control solutions trusted across global industrial sectors.
            </p>
          </div>

          {/* Grid Container */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {industries.map((ind, i) => (
              <IndustryCard
                key={ind.num}
                ind={ind}
                delay={i * 0.06}
                visible={visible}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ── CLIENTS MARQUEE STRIP ─────────────────── */}
      <section className="bg-[#FAFAF8] border-t border-slate-100 py-10 sm:py-12 overflow-hidden">

        {/* Label */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-10 mb-7 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="w-5 h-0.5 bg-[#0A8F8A] rounded-full" />
            <span className="text-[11px] sm:text-[12px] font-bold text-slate-400 uppercase tracking-[2px]">
              Our Valuable Clients
            </span>
            <div className="w-5 h-0.5 bg-[#0A8F8A] rounded-full" />
          </div>
        </div>

        {/* Scroll Track */}
        <div className="relative">
          {/* Edge Blur Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-r from-[#FAFAF8] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-l from-[#FAFAF8] to-transparent z-10 pointer-events-none" />

          {/* Scrolling Marquee Wrapper */}
          <div
            className="flex w-max py-2"
            style={{ animation: 'marqueeScroll 45s linear infinite' }}
            onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
          >
            {track.map((client, i) => (
              <ClientLogo key={i} client={client} />
            ))}
          </div>
        </div>

      </section>

      {/* Marquee Keyframes with Hardware Acceleration */}
      <style jsx global>{`
        @keyframes marqueeScroll {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
      `}</style>
    </>
  )
}