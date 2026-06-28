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

function FadeUp({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                     transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

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
    num: '01', icon: IconFlame, name: 'Oil & Gas',
    desc: 'Upstream, midstream and downstream pipeline systems requiring precision flow control under extreme pressure and temperature conditions.',
    valves: ['Ball Valve', 'Gate Valve', 'Globe Valve', 'Check Valve', 'Safety Valve'],
    color: '#ea580c',
  },
  {
    num: '02', icon: IconPill, name: 'Pharma & Food',
    desc: 'Hygienic valves for sterile process environments, clean rooms and food grade applications requiring zero contamination.',
    valves: ['Butterfly Valve', 'Ball Valve', 'Diaphragm Valve'],
    color: '#16a34a',
  },
  {
    num: '03', icon: IconDroplet, name: 'Water Treatment',
    desc: 'Municipal and industrial water distribution networks, sewage treatment and desalination plant flow control systems.',
    valves: ['Butterfly Valve', 'Gate Valve', 'Check Valve', 'Ball Valve'],
    color: '#2563eb',
  },
  {
    num: '04', icon: IconBolt, name: 'Power Plants',
    desc: 'High-pressure steam and turbine control systems for thermal, nuclear and renewable energy generation facilities.',
    valves: ['Gate Valve', 'Globe Valve', 'Safety Valve', 'Check Valve'],
    color: '#ca8a04',
  },
  {
    num: '05', icon: IconBuildingFactory, name: 'Chemical',
    desc: 'Corrosion-resistant valves for aggressive media, high temperature chemical processing and petrochemical plants.',
    valves: ['Ball Valve', 'Butterfly Valve', 'Globe Valve', 'Safety Valve'],
    color: '#7c3aed',
  },
  {
    num: '06', icon: IconAnchor, name: 'Marine',
    desc: 'Sea water resistant valves for ballast systems, bilge systems and offshore platform fluid control applications.',
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

export default function ApplicationPage() {
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
    <main className="bg-white font-sans">

      {/* Hero */}
      <section className="bg-[#102f79] py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <FadeUp delay={0}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-0.5 bg-[#4A7FA5] rounded-full" />
              <span className="text-[11px] font-medium text-[#4A7FA5] uppercase tracking-[2px] font-sans">
                Applications
              </span>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <h1 className="text-[42px] md:text-[52px] font-bold text-white tracking-tight leading-tight mb-6 max-w-2xl font-sans">
              Valves trusted across{' '}
              <span className="text-blue-300">critical</span>{' '}
              industries
            </h1>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="text-[15px] text-white/60 max-w-xl leading-relaxed font-sans font-light">
              From oil fields to pharmaceutical plants — our precision-engineered valves perform in the most demanding industrial environments worldwide.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Stats */}
      <section
        ref={statsRef}
        className="bg-[#FAFAF8] border-b border-[#EDEBE6] py-12 px-6 md:px-10"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsData.map((s, i) => (
            <div key={s.label} className="text-center">
              <div className="text-[40px] font-bold text-[#1a2e44] leading-none mb-2 tracking-tight font-sans">
                <CountUp end={s.num} suffix={s.suffix} active={statsActive} duration={1600 + i * 150} />
              </div>
              <div className="text-[13px] text-slate-500 font-medium font-sans">
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
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-0.5 bg-[#4A7FA5] rounded-full" />
                <span className="text-[11px] font-medium text-[#4A7FA5] uppercase tracking-[2px] font-sans">
                  Industries
                </span>
              </div>
              <h2 className="text-[32px] font-bold text-slate-900 tracking-tight font-sans">
                Industries We Serve
              </h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((ind, i) => {
              const Icon = ind.icon
              return (
                <FadeUp key={ind.num} delay={i * 80}>
                  <div className="relative rounded-2xl p-7 flex flex-col gap-5 border border-[#E5E2DC] hover:border-[#C8D4E0] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group cursor-pointer bg-[#FAFAF8] hover:bg-white overflow-hidden">
                    <span
                      className="absolute top-4 right-5 text-[64px] font-black leading-none select-none pointer-events-none font-sans"
                      style={{ color: 'rgba(0,0,0,0.04)' }}
                    >
                      {ind.num}
                    </span>
                    <span
                      className="text-[11px] font-semibold uppercase tracking-widest font-sans"
                      style={{ color: ind.color + '99' }}
                    >
                      {ind.num}
                    </span>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: ind.color + '15' }}
                    >
                      <Icon size={22} style={{ color: ind.color }} />
                    </div>
                    <div>
                      <h2 className="text-[18px] font-bold text-slate-900 mb-2 group-hover:text-[#1a2e44] transition-colors font-sans">
                        {ind.name}
                      </h2>
                      <p className="text-[13px] text-slate-500 leading-relaxed mb-4 font-sans font-light">
                        {ind.desc}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ind.valves.map((valve) => (
                          <span
                            key={valve}
                            className="text-[11px] px-2.5 py-1 rounded-md border font-medium font-sans"
                            style={{
                              color: ind.color,
                              borderColor: ind.color + '30',
                              background: ind.color + '10',
                            }}
                          >
                            {valve}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-1.5 text-[12px] font-medium mt-auto opacity-0 group-hover:opacity-100 transition-opacity font-sans"
                      style={{ color: ind.color }}
                    >
                      View related products
                      <IconArrowRight size={13} />
                    </div>
                    <div
                      className="absolute bottom-0 left-0 h-[2px] transition-all duration-300 group-hover:w-full w-0 rounded-b-2xl"
                      style={{ background: ind.color }}
                    />
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="py-20 px-6 md:px-10 bg-[#FAFAF8] border-t border-[#EDEBE6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUp delay={0}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-0.5 bg-[#4A7FA5] rounded-full" />
                <span className="text-[11px] font-medium text-[#4A7FA5] uppercase tracking-[2px] font-sans">
                  Why choose us
                </span>
              </div>
              <h2 className="text-[32px] font-bold text-slate-900 tracking-tight mb-4 font-sans">
                Built for the most demanding applications
              </h2>
              <p className="text-[14px] text-slate-500 leading-relaxed mb-8 font-sans font-light">
                Every valve we manufacture is tested under conditions that exceed the requirements of its intended application — ensuring zero failure in the field.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { title: 'Pressure tested', desc: 'Every unit hydro-tested before dispatch' },
                  { title: 'Material certified', desc: 'Mill test certificates for all materials' },
                  { title: 'Global standards', desc: 'API, ISO, BS, ANSI, DIN compliance' },
                  { title: 'Custom engineered', desc: 'Special alloys and sizes on request' },
                ].map((point, i) => (
                  <FadeUp key={point.title} delay={i * 60}>
                    <div className="flex items-start gap-4 p-4 border border-[#E5E2DC] rounded-xl bg-white hover:border-[#C8D4E0] transition-all">
                      <div className="w-2 h-2 bg-[#4A7FA5] rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="text-[13px] font-semibold text-slate-900 mb-0.5 font-sans">
                          {point.title}
                        </div>
                        <div className="text-[12px] text-slate-500 font-sans font-light">
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