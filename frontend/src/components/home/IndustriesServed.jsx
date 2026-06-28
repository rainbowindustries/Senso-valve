'use client'

import { useState, useEffect, useRef } from 'react'
import {
  IconFlame, IconPill, IconDroplet, IconBolt, IconBuildingFactory, IconAnchor,
} from '@tabler/icons-react'

const industries = [
  { num: '01', icon: IconFlame,           name: 'Oil & Gas',       desc: 'Upstream, midstream and downstream pipeline systems demanding zero-leak precision.' },
  { num: '02', icon: IconPill,            name: 'Pharmaceutical',  desc: 'Hygienic valves engineered for sterile process environments and FDA compliance.' },
  { num: '03', icon: IconDroplet,         name: 'Water Treatment', desc: 'Municipal and industrial water distribution networks built for continuous duty.' },
  { num: '04', icon: IconBolt,            name: 'Power Plants',    desc: 'High-pressure steam and turbine control systems for critical energy infrastructure.' },
  { num: '05', icon: IconBuildingFactory, name: 'Chemical',        desc: 'Corrosion-resistant valve solutions for aggressive media across process industries.' },
  { num: '06', icon: IconAnchor,          name: 'Marine',          desc: 'Seawater and ballast system valve solutions certified for offshore environments.' },
]

function IndustryCard({ ind, delay, visible }) {
  const [hovered, setHovered] = useState(false)
  const Icon = ind.icon

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-default border border-slate-200 bg-white group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s,
                     transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        boxShadow: hovered
          ? '0 12px 32px rgba(0,0,0,0.09)'
          : '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top colour bar — grows on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] bg-[#1a2e44] transition-all duration-300"
        style={{ opacity: hovered ? 1 : 0 }}
      />

      {/* Card body */}
      <div className="p-5 sm:p-6 flex flex-col gap-4">

        {/* Top row: icon + number */}
        <div className="flex items-start justify-between">
          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border transition-all duration-200 ${
            hovered
              ? 'bg-[#1a2e44] border-[#1a2e44]'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <Icon size={18} strokeWidth={1.5} color={hovered ? '#93C5FD' : '#4A7FA5'} />
          </div>
          <span className="text-[32px] sm:text-[36px] font-bold leading-none text-slate-100 select-none">
            {ind.num}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Text */}
        <div>
          <h3 className={`text-[14px] sm:text-[14.5px] font-semibold mb-1.5 leading-snug tracking-tight transition-colors duration-200 ${
            hovered ? 'text-[#1a2e44]' : 'text-slate-800'
          }`}>
            {ind.name}
          </h3>
          <p className="text-[12.5px] sm:text-[13px] text-slate-400 leading-relaxed m-0">
            {ind.desc}
          </p>
        </div>

      </div>
    </div>
  )
}

export default function IndustriesServed() {
  const [visible, setVisible]     = useState(false)
  const [headerVis, setHeaderVis] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); setHeaderVis(true) } },
      { threshold: 0.08 },
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
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

        {/* Grid — 2 cols mobile, 3 sm, 6 lg */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {industries.map((ind, i) => (
            <IndustryCard key={ind.num} ind={ind} delay={i * 0.06} visible={visible} />
          ))}
        </div>

      </div>
    </section>
  )
}