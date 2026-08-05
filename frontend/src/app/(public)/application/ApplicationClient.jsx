'use client'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  IconFlame,
  IconPill,
  IconDroplet,
  IconBolt,
  IconBuildingFactory,
  IconAnchor,
  IconArrowRight,
} from '@tabler/icons-react'
import { useInView } from 'react-intersection-observer'

// ─── FadeUp Animation Component ─────────────────────
function FadeUp({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
                     transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── CountUp Stat Counter Component ──────────────────
function CountUp({ end, suffix = '', duration = 1800, active }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    const endValue = parseInt(end.replace(/\D/g, ''), 10)
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(eased * endValue))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, end, duration])
  return <span>{count}{suffix}</span>
}

const industries = [
  {
    num: '01', icon: IconFlame, name: 'Oil & Gas Valves',
    desc: 'Upstream, midstream and downstream pipeline systems requiring precision ball valves, gate valves, and globe valves under extreme pressure and temperature conditions.',
    valves: ['Ball Valve', 'Gate Valve', 'Globe Valve', 'Check Valve', 'Safety Valve'],
    color: '#ea580c',
  },
  {
    num: '02', icon: IconPill, name: 'Pharma & Food Industry Valves',
    desc: 'Hygienic butterfly valves and ball valves for sterile process environments, clean rooms and food grade applications requiring zero contamination.',
    valves: ['Butterfly Valve', 'Ball Valve', 'Diaphragm Valve'],
    color: '#16a34a',
  },
  {
    num: '03', icon: IconDroplet, name: 'Water Treatment Valves',
    desc: 'Municipal and industrial water distribution networks, sewage treatment and desalination plant butterfly, gate, and check valve flow control systems.',
    valves: ['Butterfly Valve', 'Gate Valve', 'Check Valve', 'Ball Valve'],
    color: '#2563eb',
  },
  {
    num: '04', icon: IconBolt, name: 'Power Plant Valves',
    desc: 'High-pressure steam and turbine control gate, globe, safety, and check valves for thermal, nuclear and renewable energy generation facilities.',
    valves: ['Gate Valve', 'Globe Valve', 'Safety Valve', 'Check Valve'],
    color: '#ca8a04',
  },
  {
    num: '05', icon: IconBuildingFactory, name: 'Chemical Processing Valves',
    desc: 'Corrosion-resistant alloy ball valves, butterfly valves, and globe valves for aggressive chemical media and high temperature petrochemical processing.',
    valves: ['Ball Valve', 'Butterfly Valve', 'Globe Valve', 'Safety Valve'],
    color: '#7c3aed',
  },
  {
    num: '06', icon: IconAnchor, name: 'Marine Industry Valves',
    desc: 'Sea water resistant bronze and stainless steel valves for ballast systems, bilge systems and offshore platform fluid control applications.',
    valves: ['Ball Valve', 'Butterfly Valve', 'Gate Valve', 'Check Valve'],
    color: '#0891b2',
  },
]

const statsData = [
  { num: '6', suffix: '+', label: 'Industries served' },
  { num: '40', suffix: '+', label: 'Countries exported' },
  { num: '500', suffix: '+', label: 'Valve products' },
  { num: '25', suffix: '+', label: 'Years experience' },
]

export default function ApplicationClient() {
  const statsRef = useRef(null)
  const [statsActive, setStatsActive] = useState(false)

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

  return (
    <main className="bg-white font-sans overflow-hidden">

      {/* Hero */}
      <section className="bg-[#1E4356] py-16 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
        <div className="absolute left-10 top-5 w-40 h-40 bg-[#EF8135]/[0.05] rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <FadeUp delay={0}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-0.5 bg-[#EF8135] rounded-full" />
              <span className="text-[11px] font-bold text-white/80 uppercase tracking-[2.5px]">
                Applications
              </span>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <h1 className="text-[36px] md:text-[46px] font-extrabold text-white tracking-tight leading-tight mb-5 max-w-2xl">
              Industrial Valves Trusted Across{' '}
              <span className="text-[#FFC299]">Critical</span>{' '}
              Sectors
            </h1>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="text-[15px] sm:text-[16px] text-white/80 max-w-xl leading-relaxed">
              From oil & gas pipelines to pharmaceutical plants — our precision-engineered Ball, Gate, Globe, Check, and Butterfly Valves perform in the most demanding industrial fluid environments worldwide.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section
        ref={statsRef}
        className="bg-[#FAFAF8] border-b border-[#EDEBE6] py-12 px-6 md:px-10"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsData.map((s, i) => (
            <div key={s.label} className="text-center">
              <div className="text-[40px] font-black text-[#1E4356] leading-none mb-2.5 tracking-tight">
                <CountUp end={s.num} suffix={s.suffix} active={statsActive} duration={1600 + i * 150} />
              </div>
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Industries grid */}
      <section className="py-20 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeUp delay={0}>
            <div className="mb-12 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-0.5 bg-[#0A8F8A] rounded-full" />
                <span className="text-[11px] font-bold text-[#0A8F8A] uppercase tracking-[2px]">
                  Industries
                </span>
                <div className="w-6 h-0.5 bg-[#0A8F8A] rounded-full" />
              </div>
              <h2 className="text-[32px] font-black text-slate-900 tracking-tight">
                Industrial Valve Applications
              </h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, i) => {
              const Icon = ind.icon
              return (
                <FadeUp key={ind.num} delay={i * 80}>
                  <div className="group relative rounded-2xl p-8 flex flex-col gap-5 border border-[#E5E2DC] bg-[#FAFAF8] hover:bg-white transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#0A8F8A]/45 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-[#0A8F8A]/5 cursor-pointer overflow-hidden">
                    <span
                      className="absolute top-4 right-5 text-[64px] font-black leading-none select-none pointer-events-none transition-colors duration-500 group-hover:text-slate-100"
                      style={{ color: 'rgba(0,0,0,0.03)' }}
                    >
                      {ind.num}
                    </span>
                    <span
                      className="text-[11px] font-bold uppercase tracking-widest"
                      style={{ color: ind.color }}
                    >
                      {ind.num}
                    </span>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                      style={{ background: ind.color + '12' }}
                    >
                      <Icon size={22} style={{ color: ind.color }} />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-slate-900 mb-2 transition-colors duration-300 group-hover:text-[#0A8F8A]">
                        {ind.name}
                      </h3>
                      <p className="text-[13px] text-slate-500 leading-relaxed mb-4 font-light">
                        {ind.desc}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ind.valves.map((valve) => (
                          <span
                            key={valve}
                            className="text-[11px] px-2.5 py-1 rounded-md border font-semibold"
                            style={{
                              color: ind.color,
                              borderColor: ind.color + '25',
                              background: ind.color + '07',
                            }}
                          >
                            {valve}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div
                      className="flex items-center gap-1.5 text-[12px] font-bold mt-auto opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                      style={{ color: ind.color }}
                    >
                      <Link href="/products">
                        View related valve products
                      </Link>
                      <IconArrowRight size={13} strokeWidth={2.5} />
                    </div>

                    <div
                      className="absolute bottom-0 left-0 h-[3px] transition-all duration-500 group-hover:w-full w-0 rounded-b-2xl"
                      style={{ background: ind.color }}
                    />
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 md:px-10 bg-[#FAFAF8] border-t border-[#EDEBE6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUp delay={0}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-0.5 bg-[#0A8F8A] rounded-full" />
                <span className="text-[11px] font-bold text-[#0A8F8A] uppercase tracking-[2px]">
                  Why Choose Us
                </span>
              </div>
              <h2 className="text-[32px] font-black text-slate-900 tracking-tight mb-4">
                Built for the Most Demanding Valve Applications
              </h2>
              <p className="text-[14px] text-slate-500 leading-relaxed mb-8 font-light">
                Every industrial valve we manufacture is tested under conditions that exceed the requirements of its intended application — ensuring zero failure in high-pressure fluid control fields.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Pressure tested valves', desc: 'Every valve unit hydro-tested before dispatch' },
                  { title: 'Material certified', desc: 'Mill test certificates for all valve materials' },
                  { title: 'Global valve standards', desc: 'API, ISO, BS, ANSI, DIN compliance' },
                  { title: 'Custom valve engineering', desc: 'Special alloys and sizes on request' },
                ].map((point, i) => (
                  <FadeUp key={point.title} delay={i * 60}>
                    <div className="flex items-start gap-4 p-5 border border-[#E5E2DC] rounded-2xl bg-white hover:border-[#0A8F8A]/40 transition-all duration-300 h-full shadow-sm hover:shadow-md">
                      <div className="w-2 h-2 bg-[#0A8F8A] rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="text-[13.5px] font-bold text-slate-900 mb-0.5">
                          {point.title}
                        </div>
                        <div className="text-[12px] text-slate-500 leading-relaxed font-light">
                          {point.desc}
                        </div>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>

            </div>
          </FadeUp>
        </div>
      </section>

    </main>
  )
}
