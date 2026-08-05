'use client'
import { useRef, useEffect, useState } from 'react'
import {
  IconAward,
  IconUsers,
  IconBuildingFactory,
  IconCertificate,
  IconShieldCheck,
  IconRosette,
  IconTarget,
  IconEye,
  IconCompass,
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

const stats = [
  { num: '25', suffix: '+', label: 'Years of experience' },
  { num: '500', suffix: '+', label: 'Products manufactured' },
  { num: '40', suffix: '+', label: 'Countries exported' },
  { num: '5000', suffix: '+', label: 'Global clients' },
]

const certs = [
  { icon: IconCertificate, name: 'ISO 9001:2015', desc: 'Quality management system' },
  { icon: IconShieldCheck, name: 'API 6D', desc: 'Pipeline valves standard' },
  { icon: IconAward, name: 'IBR Approved', desc: 'Indian boiler regulations' },
  { icon: IconRosette, name: 'CE Marked', desc: 'European conformity' },
]

const team = [
  { name: 'Alpesh bhai Dalsaniya', role: 'Managing Director', exp: '25+ years in valve industry' },
  { name: 'Bhavesh bhai Dalsaniya', role: 'Technical Director', exp: '25+ years in valve industry' },
  { name: 'Dev Dalsaniya', role: 'Export Manager', exp: '15+ years international trade' },
]

export default function AboutClient() {
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

      {/* ── HERO SECTION ──────────────────────────────── */}
      <section className="bg-[#1E4356] py-20 px-6 md:px-10 relative">
        {/* Subtle decorative circles for depth */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
        <div className="absolute left-10 top-10 w-48 h-48 bg-[#EF8135]/[0.05] rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto z-10">
          <FadeUp delay={0}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-0.5 bg-[#EF8135] rounded-full" />
              <span className="text-[11px] font-bold text-white/80 uppercase tracking-[2.5px]">
                About us
              </span>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <h1 className="text-[36px] md:text-[48px] font-extrabold text-white tracking-tight leading-tight max-w-3xl mb-6">
              Engineering Reliable Industrial Valves with Precision and Quality.
            </h1>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="text-[15px] sm:text-[16px] text-white/75 leading-relaxed max-w-2xl">
              Trusted by key industrial sectors across the globe for dependable flow control and automation solutions.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── STATS SECTION ─────────────────────────────── */}
      <section
        ref={statsRef}
        className="bg-[#FAFAF8] border-b border-[#EDEBE6] py-14 px-6 md:px-10"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={s.label} className="text-center">
              <div className="text-[40px] font-black text-[#1E4356] leading-none mb-2.5 tracking-tight">
                <CountUp
                  end={s.num}
                  suffix={s.suffix}
                  active={statsActive}
                  duration={1600 + i * 200}
                />
              </div>
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 1: ABOUT VERTEX VALVE ─────────────── */}
      <section className="py-20 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image with Hover Glow */}
          <FadeUp delay={100} className="w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 group">
              <img
                src="/about-valve.png"
                alt="Vertex Industrial Valve Manufacturer Facilities"
                className="w-full h-auto object-cover max-h-[460px] transform transition-transform duration-[1000ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#0A8F8A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </FadeUp>

          {/* Right Column: About Content */}
          <FadeUp delay={200}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-0.5 bg-[#0A8F8A] rounded-full" />
                <span className="text-[11px] font-bold text-[#0A8F8A] uppercase tracking-[2.5px]">
                  Who We Are
                </span>
              </div>
              <h2 className="text-[30px] md:text-[36px] font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                About Vertex Valve (Rainbow Industries)
              </h2>
              <div className="text-[14px] text-slate-500 leading-relaxed flex flex-col gap-4">
                <p>
                  Established in <strong>2001</strong> in Rajkot, Gujarat, <strong>Vertex Valve (Define Industries)</strong> is a leading manufacturer and supplier of premium industrial valves, including Ball Valves, Gate Valves, Globe Valves, Check Valves, Butterfly Valves, and customized flow control solutions.
                </p>
                <p>
                  With a strong focus on precision engineering, high-grade certified materials, and customer satisfaction, we deliver reliable and durable industrial valve products built for a wide range of applications in Oil & Gas, Water Treatment, Power Plants, and Chemical Processing.
                </p>
                <p>
                  Driven by innovation, advanced manufacturing processes, and strict quality assurance standards, we produce industrial valves that satisfy both national and international requirements. Our commitment to continuous development has earned us the trust of clients globally in over 40 countries.
                </p>
              </div>
            </div>
          </FadeUp>

        </div>
      </section>

      {/* ── SECTION 2: JOURNEY OF EXCELLENCE ──────────── */}
      <section className="py-20 px-6 md:px-10 bg-[#FAFAF8] border-t border-b border-[#EDEBE6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Journey Content */}
          <FadeUp delay={100} className="order-2 lg:order-1">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-0.5 bg-[#0A8F8A] rounded-full" />
                <span className="text-[11px] font-bold text-[#0A8F8A] uppercase tracking-[2px]">
                  Our Legacy
                </span>
              </div>
              <h2 className="text-[30px] md:text-[36px] font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                Journey of Engineering Excellence
              </h2>
              <div className="text-[14px] text-slate-500 leading-relaxed flex flex-col gap-4">
                <p>
                  Founded with a vision to manufacture world-class industrial valves, Vertex Valve has grown into a globally recognized flow control manufacturer.
                </p>
                <p>
                  Today, our valve systems are widely integrated across pipeline systems, chemical processing plants, refineries, water distribution systems, power plants, and infrastructure developments.
                </p>
                <p>
                  Every industrial valve that departs our facility undergoes rigorous non-destructive testing, hydrostatic pressure inspections, and quality certifications to guarantee high-performance sealing under extreme high-pressure parameters.
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Right Column: Facility Image */}
          <FadeUp delay={200} className="order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 group">
              <img
                src="/about-facility.png"
                alt="Vertex Industrial Valve Manufacturing Facility in Rajkot"
                className="w-full h-auto object-cover max-h-[460px] transform transition-transform duration-[1000ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#0A8F8A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </FadeUp>

        </div>
      </section>

      {/* ── SECTION 3: VISION, MISSION, GOALS (CORE CARDS) ── */}
      <section className="py-20 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeUp delay={0}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-5 h-0.5 bg-[#0A8F8A] rounded-full" />
                <span className="text-[11px] font-bold text-[#0A8F8A] uppercase tracking-[2px]">
                  Core Values
                </span>
                <div className="w-5 h-0.5 bg-[#0A8F8A] rounded-full" />
              </div>
              <h2 className="text-[32px] font-black text-slate-900 tracking-tight mb-3">
                Built on Firm Principles
              </h2>
              <p className="text-[14px] text-slate-500 max-w-lg mx-auto">
                Guiding our industrial valve operations, client interactions, and manufacturing developments daily.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: IconEye,
                title: 'Our Vision',
                desc: 'To be recognized as a trusted global leader in industrial valve manufacturing, setting benchmarks in quality, safety, and flow control innovation.',
              },
              {
                icon: IconTarget,
                title: 'Our Mission',
                desc: 'To deliver high-performance, innovative, and cost-effective industrial valve solutions that meet the evolving needs of global fluid handling industries.',
              },
              {
                icon: IconCompass,
                title: 'Our Goals',
                desc: 'We aim to deliver innovative valve solutions, maintain top-tier ISO quality, and expand globally while ensuring customer satisfaction and sustainable growth.',
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <FadeUp key={item.title} delay={i * 100}>
                  <div className="group relative h-full rounded-2xl border border-[#E5E2DC] bg-[#FAFAF8] p-8 flex flex-col items-center text-center gap-5 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:bg-white hover:border-[#0A8F8A]/40 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(10,143,138,0.08)]">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent group-hover:bg-[#0A8F8A] transition-all duration-[600ms]" />
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center transition-all duration-[600ms] group-hover:bg-[#0A8F8A]/10 group-hover:scale-110">
                      <Icon size={26} className="text-[#3B6982] transition-colors duration-500 group-hover:text-[#0A8F8A]" />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-slate-900 mb-2.5 transition-colors group-hover:text-[#0A8F8A]">
                        {item.title}
                      </h3>
                      <p className="text-[13px] text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: CERTIFICATIONS ────────────────── */}
      <section className="py-20 px-6 md:px-10 bg-[#FAFAF9] border-t border-[#EDEBE6]" id="certifications">
        <div className="max-w-7xl mx-auto">
          <FadeUp delay={0}>
            <div className="mb-12 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-0.5 bg-[#3B6982] rounded-full" />
                <span className="text-[11px] font-bold text-[#3B6982] uppercase tracking-[2px]">
                  Certifications
                </span>
                <div className="w-6 h-0.5 bg-[#3B6982] rounded-full" />
              </div>
              <h2 className="text-[32px] font-bold text-slate-900 tracking-tight">
                Globally Certified Quality Valve Standards
              </h2>
            </div>
          </FadeUp>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certs.map((cert, i) => {
              const Icon = cert.icon
              return (
                <FadeUp key={cert.name} delay={i * 80}>
                  <div className="bg-white border border-[#E5E2DC] rounded-xl p-6 hover:border-slate-350 hover:shadow-md transition-all duration-300">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                      <Icon size={24} className="text-[#3B6982]" />
                    </div>
                    <div className="text-[15px] font-bold text-slate-900 mb-1">
                      {cert.name}
                    </div>
                    <div className="text-[13px] text-slate-500 leading-relaxed">
                      {cert.desc}
                    </div>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: TEAM ──────────────────────────── */}
      <section className="py-20 px-6 md:px-10 bg-white border-t border-[#EDEBE6]">
        <div className="max-w-7xl mx-auto">
          <FadeUp delay={0}>
            <div className="mb-12 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-0.5 bg-[#3B6982] rounded-full" />
                <span className="text-[11px] font-bold text-[#3B6982] uppercase tracking-[2px]">
                  Our team
                </span>
                <div className="w-6 h-0.5 bg-[#3B6982] rounded-full" />
              </div>
              <h2 className="text-[32px] font-bold text-slate-900 tracking-tight">
                Leadership Team in Valve Manufacturing
              </h2>
            </div>
          </FadeUp>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <FadeUp key={member.name} delay={i * 80}>
                <div className="border border-[#E5E2DC] rounded-xl p-6 bg-[#FAFAF8] hover:border-slate-355 hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <IconUsers size={24} className="text-[#3B6982]" />
                  </div>
                  <div className="text-[14px] font-bold text-slate-900 mb-1">
                    {member.name}
                  </div>
                  <div className="text-[12px] text-[#3B6982] font-semibold mb-2">
                    {member.role}
                  </div>
                  <div className="text-[12px] text-slate-500 border-t border-slate-200/60 pt-2.5 mt-2.5">
                    {member.exp}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
