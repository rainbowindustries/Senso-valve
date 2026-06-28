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
} from '@tabler/icons-react'
import { useInView } from 'react-intersection-observer'

// ─── FadeUp ────────────────────────────────────────
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

// ─── CountUp ───────────────────────────────────────
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

export default function AboutPage() {
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
    <main className="bg-white">

      {/* Hero */}
      <section className="bg-[#102f79] py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <FadeUp delay={0}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-0.5 bg-[#4A7FA5] rounded-full" />
              <span className="text-[11px] font-medium text-[#4A7FA5] uppercase tracking-[2px]">
                About us
              </span>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <h1 className="text-[36px] md:text-[48px] font-bold text-white tracking-tight leading-tight max-w-2xl mb-6">
              Engineering precision valves since{' '}
              <span className="text-blue-300">2001</span>
            </h1>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="text-[15px] text-white/60 leading-relaxed max-w-2xl">
              Hammer Valve Industries is a Rajkot-based manufacturer and exporter of industrial valves and automation solutions. We serve critical industries across 40+ countries with precision-engineered products backed by global certifications.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Stats */}
      <section
        ref={statsRef}
        className="bg-[#FAFAF8] border-b border-[#EDEBE6] py-14 px-6 md:px-10"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={s.label} className="text-center">
              <div className="text-[40px] font-bold text-[#1a2e44] leading-none mb-2 tracking-tight">
                <CountUp
                  end={s.num}
                  suffix={s.suffix}
                  active={statsActive}
                  duration={1600 + i * 200}
                />
              </div>
              <div className="text-[13px] text-slate-500 font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <FadeUp delay={0}>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-0.5 bg-[#4A7FA5] rounded-full" />
                <span className="text-[11px] font-medium text-[#4A7FA5] uppercase tracking-[2px]">
                  Our story
                </span>
              </div>
              <h2 className="text-[32px] font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                Built in the heart of India's industrial city
              </h2>
              <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                Founded in 2001 in Rajkot — India's industrial hub — Hammer Valve Industries began as a small valve manufacturing unit with a vision to deliver world-class industrial valves at competitive prices.
              </p>
              <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                Over two decades, we have grown into a full-scale manufacturer and exporter with a product range covering 500+ valve types and automation solutions, serving oil & gas, pharma, water treatment, power and chemical industries globally.
              </p>
              <p className="text-[14px] text-slate-500 leading-relaxed">
                Every valve we manufacture undergoes rigorous quality control and testing before leaving our facility — ensuring reliability in the most critical applications worldwide.
              </p>
            </div>
          </FadeUp>

          <div className="flex flex-col gap-4">
            {[
              {
                icon: IconTarget,
                title: 'Our mission',
                desc: 'To manufacture precision industrial valves that meet the highest international standards while delivering exceptional value to our global customers.',
              },
              {
                icon: IconEye,
                title: 'Our vision',
                desc: 'To be the most trusted name in industrial valve manufacturing across Asia and beyond, known for quality, reliability and technical expertise.',
              },
              {
                icon: IconBuildingFactory,
                title: 'Manufacturing facility',
                desc: '50,000 sq. ft. facility at GIDC Estate, Rajkot with CNC machining, pressure testing, NDT lab and ISO-certified quality control.',
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <FadeUp key={item.title} delay={i * 100}>
                  <div className="flex items-start gap-4 p-5 border border-[#E5E2DC] rounded-xl bg-[#FAFAF8] hover:border-[#C8D4E0] hover:bg-white transition-all">
                    <div className="w-10 h-10 bg-[#EEF2F7] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={20} color="#4A7FA5" />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-slate-900 mb-1">
                        {item.title}
                      </div>
                      <div className="text-[13px] text-slate-500 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 px-6 md:px-10 bg-[#FAFAF8] border-t border-[#EDEBE6]" id="certifications">
        <div className="max-w-7xl mx-auto">
          <FadeUp delay={0}>
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-0.5 bg-[#4A7FA5] rounded-full" />
                <span className="text-[11px] font-medium text-[#4A7FA5] uppercase tracking-[2px]">
                  Certifications
                </span>
              </div>
              <h2 className="text-[32px] font-bold text-slate-900 tracking-tight">
                Globally certified quality
              </h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certs.map((cert, i) => {
              const Icon = cert.icon
              return (
                <FadeUp key={cert.name} delay={i * 80}>
                  <div className="bg-white border border-[#E5E2DC] rounded-xl p-6 hover:border-[#C8D4E0] hover:shadow-md hover:shadow-black/5 transition-all">
                    <div className="w-12 h-12 bg-[#EEF2F7] rounded-xl flex items-center justify-center mb-4">
                      <Icon size={24} color="#4A7FA5" />
                    </div>
                    <div className="text-[15px] font-semibold text-slate-900 mb-1">
                      {cert.name}
                    </div>
                    <div className="text-[13px] text-slate-500">
                      {cert.desc}
                    </div>
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 md:px-10 bg-white border-t border-[#EDEBE6]">
        <div className="max-w-7xl mx-auto">
          <FadeUp delay={0}>
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-0.5 bg-[#4A7FA5] rounded-full" />
                <span className="text-[11px] font-medium text-[#4A7FA5] uppercase tracking-[2px]">
                  Our team
                </span>
              </div>
              <h2 className="text-[32px] font-bold text-slate-900 tracking-tight">
                Leadership team
              </h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <FadeUp key={member.name} delay={i * 80}>
                <div className="border border-[#E5E2DC] rounded-xl p-6 bg-[#FAFAF8] hover:border-[#C8D4E0] hover:bg-white transition-all">
                  <div className="w-14 h-14 bg-[#1a2e44] rounded-full flex items-center justify-center mb-4">
                    <IconUsers size={24} color="#93C5FD" />
                  </div>
                  <div className="text-[14px] font-semibold text-slate-900 mb-1">
                    {member.name}
                  </div>
                  <div className="text-[12px] text-[#4A7FA5] font-medium mb-2">
                    {member.role}
                  </div>
                  <div className="text-[12px] text-slate-500">
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