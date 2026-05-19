import Link from 'next/link'
import {
  IconAward, IconLayoutGrid,
  IconFileDownload, IconCircleCheck
} from '@tabler/icons-react'

const certifications = [
  'ISO 9001:2015',
  'API 6D',
  'CE Marked',
  'IBR Approved',
  'ATEX',
]

const stats = [
  { num: '500+', label: 'Products' },
  { num: '25+', label: 'Years experience' },
  { num: '40+', label: 'Countries exported' },
  { num: '5,000+', label: 'Global clients' },
]

export default function HeroSection() {
  return (
    <section>

      {/* Hero */}
      <div className="relative min-h-[520px] flex items-center justify-center overflow-hidden bg-[#0f1f35]">

        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Blue Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: '600px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 py-20">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 text-blue-300 text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-7">
            <IconAward size={13} />
            ISO 9001:2015 Certified manufacturer
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-medium text-white leading-[1.18] tracking-tight mb-5">
            Precision Industrial Valves<br />
            Trusted by{' '}
            <em className="not-italic text-blue-400">Global</em>{' '}
            Engineers
          </h1>

          {/* Subtext */}
          <p className="text-[15px] text-slate-400 leading-relaxed mb-8 max-w-xl mx-auto">
            Manufacturer & exporter of manual and automated valves for oil & gas, pharma, power and water treatment industries across 40+ countries.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/products"
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-[14px] font-medium px-7 py-3 rounded-lg transition-colors"
            >
              <IconLayoutGrid size={16} />
              Explore products
            </Link>
            <Link
              href="/catalogue"
              className="flex items-center gap-2 bg-white/8 hover:bg-white/12 border border-white/15 text-slate-300 text-[14px] px-7 py-3 rounded-lg transition-colors backdrop-blur-sm"
            >
              <IconFileDownload size={16} />
              Download catalogue
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/4 backdrop-blur-sm border-t border-white/8">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center">
            {stats.map((s, i) => (
              <div
                key={i}
                className="px-8 py-4 text-center border-r border-white/8 last:border-r-0 flex-1 min-w-[120px]"
              >
                <div className="text-[22px] font-medium text-white leading-none">
                  {s.num}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 tracking-wide">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certification Strip */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <span className="text-[11px] text-slate-400 uppercase tracking-widest font-medium whitespace-nowrap">
            Certified by
          </span>
          <div className="w-px h-5 bg-slate-200 hidden sm:block" />
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <div
                key={cert}
                className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-[12px] text-[#1e3a5f] font-medium"
              >
                <IconCircleCheck size={13} color="#3b82f6" />
                {cert}
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}