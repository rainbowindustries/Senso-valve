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
  { num: '05', icon: IconBuildingFactory, name: 'Chemical', desc: 'Corrosion-resistant valve solutions for aggressive media across process industries.' },
  { num: '06', icon: IconAnchor, name: 'Marine', desc: 'Seawater and ballast system valve solutions certified for offshore environments.' },
]

// ── Client logos ──────────────────────────────────
// Replace src with your real logo image paths like '/logos/reliance.png'
// If no image, it shows the company name as text
const clients = [
  { name: 'Reliance Industries', src: '/download (2).png' },
  { name: 'Adani Group', src: '/download (3).png' },
  { name: 'Tata Projects', src: '/download (4).png' },
  { name: 'GAIL India', src: null },
  { name: 'ONGC', src: null },
  { name: 'Essar Oil', src: null },
  { name: 'Bharat Petroleum', src: null },
  { name: 'Hindustan Zinc', src: null },
  { name: 'Vedanta', src: null },
  { name: 'NTPC', src: null },
]

// ── Industry Card ─────────────────────────────────
function IndustryCard({ ind, delay, visible }) {
  const [hovered, setHovered] = useState(false)
  const Icon = ind.icon

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-default border"
      style={{
        background: hovered ? '#1a2e44' : '#FAFAF8',
        borderColor: hovered ? '#1a2e44' : '#E5E2DC',
        opacity: visible ? 1 : 0,
        transform: visible
          ? (hovered ? 'translateY(-3px)' : 'translateY(0)')
          : 'translateY(20px)',
        transition: `
          opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s,
          transform 0.3s cubic-bezier(0.22,1,0.36,1),
          background 0.3s ease,
          border-color 0.3s ease
        `,
        boxShadow: hovered
          ? '0 16px 40px rgba(26,46,68,0.22)'
          : '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* Faded number */}
      <span
        className="absolute top-3 right-4 text-[56px] font-black leading-none select-none pointer-events-none transition-colors duration-300"
        style={{ color: hovered ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
      >
        {ind.num}
      </span>

      <div className="relative p-5 sm:p-6 flex flex-col gap-4">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300"
          style={{
            background: hovered ? 'rgba(74,127,165,0.18)' : '#EEF2F7',
            borderColor: hovered ? 'rgba(147,197,253,0.25)' : '#C8D4E0',
          }}
        >
          <Icon size={19} strokeWidth={1.6} color={hovered ? '#93C5FD' : '#4A7FA5'} />
        </div>

        {/* Text */}
        <div>
          <h3
            className="text-[14.5px] font-bold mb-1.5 leading-snug tracking-tight transition-colors duration-300"
            style={{ color: hovered ? '#ffffff' : '#0f172a' }}
          >
            {ind.name}
          </h3>
          <p
            className="text-[12.5px] leading-relaxed m-0 transition-colors duration-300"
            style={{ color: hovered ? 'rgba(255,255,255,0.50)' : '#64748b' }}
          >
            {ind.desc}
          </p>
        </div>

        {/* Counter */}
        <div
          className="pt-4 border-t transition-colors duration-300"
          style={{ borderColor: hovered ? 'rgba(255,255,255,0.1)' : '#F1F5F9' }}
        >
          <span
            className="text-[10.5px] font-semibold uppercase tracking-widest transition-colors duration-300"
            style={{ color: hovered ? 'rgba(147,197,253,0.65)' : '#94a3b8' }}
          >
            {ind.num} / 06
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Marquee strip ──────────────────────────────────
function ClientLogo({ client }) {
  if (client.src) {
    return (
      <div className="flex items-center justify-center flex-shrink-0 mx-8 sm:mx-12">
        <img
  src={client.src}
  alt={client.name}
  className="h-16 sm:h-20 lg:h-24 w-auto object-contain opacity-60 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0"
/>
      </div>
    )
  }
  // Text fallback when no logo image
  return (
    <div className="flex items-center gap-2.5 flex-shrink-0 mx-6 sm:mx-10">
      <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
        <span className="text-[11px] font-black text-slate-400">
          {client.name.charAt(0)}
        </span>
      </div>
      <span className="text-[14px] sm:text-[15px] font-semibold text-slate-400 whitespace-nowrap tracking-tight">
        {client.name}
      </span>
    </div>
  )
}

// ── Main component ─────────────────────────────────
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

  // Duplicate clients enough times for seamless loop
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
            className="mb-8 sm:mb-10 lg:mb-12"
            style={{
              opacity: headerVis ? 1 : 0,
              transform: headerVis ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-0.5 bg-[#4A7FA5] rounded-full" />
              <span className="text-[10.5px] font-semibold text-[#4A7FA5] uppercase tracking-[2px]">
                Applications
              </span>
            </div>
            <h2 className="text-[clamp(22px,3vw,32px)] font-bold text-slate-900 leading-tight tracking-tight mb-2">
              Industries We Serve
            </h2>
            <p className="text-[13.5px] text-slate-500 leading-relaxed max-w-md">
              Critical fluid control solutions trusted across global industrial sectors.
            </p>
          </div>

          {/* Grid */}
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
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-10 mb-7">
          <div className="flex items-center gap-3">
            <div className="w-5 h-0.5 bg-[#4A7FA5] rounded-full" />
            <span className="text-[11px] sm:text-[12px] font-bold text-slate-400 uppercase tracking-[2px]">
              Our Esteemed Clients
            </span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
        </div>

        {/* Scroll track */}
        <div className="relative">

          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#FAFAF8] to-transparent z-10 pointer-events-none" />

          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#FAFAF8] to-transparent z-10 pointer-events-none" />

          {/* Track */}
          <div
            className="flex w-max"
            style={{ animation: 'marqueeScroll 36s linear infinite' }}
            onMouseEnter={e => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={e => e.currentTarget.style.animationPlayState = 'running'}
          >
            {track.map((client, i) => (
              <ClientLogo key={i} client={client} />
            ))}
          </div>

        </div>

      </section>

      {/* ── Keyframes ─────────────────────────────── */}
      <style jsx global>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </>
  )
}