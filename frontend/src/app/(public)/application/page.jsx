import {
  IconFlame,
  IconPill,
  IconDroplet,
  IconBolt,
  IconBuildingFactory,
  IconAnchor,
  IconArrowRight,
} from '@tabler/icons-react'

const industries = [
  {
    num: '01',
    icon: IconFlame,
    name: 'Oil & Gas',
    desc: 'Upstream, midstream and downstream pipeline systems requiring precision flow control under extreme pressure and temperature conditions.',
    valves: ['Ball Valve', 'Gate Valve', 'Globe Valve', 'Check Valve', 'Safety Valve'],
    color: '#f97316',
    bg: 'from-orange-950/40 to-slate-900',
  },
  {
    num: '02',
    icon: IconPill,
    name: 'Pharma & Food',
    desc: 'Hygienic valves for sterile process environments, clean rooms and food grade applications requiring zero contamination.',
    valves: ['Butterfly Valve', 'Ball Valve', 'Diaphragm Valve'],
    color: '#22c55e',
    bg: 'from-green-950/40 to-slate-900',
  },
  {
    num: '03',
    icon: IconDroplet,
    name: 'Water Treatment',
    desc: 'Municipal and industrial water distribution networks, sewage treatment and desalination plant flow control systems.',
    valves: ['Butterfly Valve', 'Gate Valve', 'Check Valve', 'Ball Valve'],
    color: '#3b82f6',
    bg: 'from-blue-950/40 to-slate-900',
  },
  {
    num: '04',
    icon: IconBolt,
    name: 'Power Plants',
    desc: 'High-pressure steam and turbine control systems for thermal, nuclear and renewable energy generation facilities.',
    valves: ['Gate Valve', 'Globe Valve', 'Safety Valve', 'Check Valve'],
    color: '#eab308',
    bg: 'from-yellow-950/40 to-slate-900',
  },
  {
    num: '05',
    icon: IconBuildingFactory,
    name: 'Chemical',
    desc: 'Corrosion-resistant valves for aggressive media, high temperature chemical processing and petrochemical plants.',
    valves: ['Ball Valve', 'Butterfly Valve', 'Globe Valve', 'Safety Valve'],
    color: '#a855f7',
    bg: 'from-purple-950/40 to-slate-900',
  },
  {
    num: '06',
    icon: IconAnchor,
    name: 'Marine',
    desc: 'Sea water resistant valves for ballast systems, bilge systems and offshore platform fluid control applications.',
    valves: ['Ball Valve', 'Butterfly Valve', 'Gate Valve', 'Check Valve'],
    color: '#06b6d4',
    bg: 'from-cyan-950/40 to-slate-900',
  },
]

export const metadata = {
  title: 'Applications | Hammer Valve Industries',
  description: 'Industrial valve solutions for oil & gas, pharma, water treatment, power plants, chemical and marine industries.',
}

export default function ApplicationPage() {
  return (
    <main>

      {/* Hero */}
      <section className="relative bg-[#0f172a] py-24 px-6 overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-[11px] text-blue-500 uppercase tracking-widest font-medium mb-4">
            Applications
          </p>
          <h1 className="text-[42px] md:text-[52px] font-medium text-white tracking-tight leading-tight mb-6 max-w-2xl">
            Valves trusted across{' '}
            <span className="text-blue-400">critical</span>{' '}
            industries
          </h1>
          <p className="text-[15px] text-slate-400 max-w-xl leading-relaxed">
            From oil fields to pharmaceutical plants — our precision-engineered valves perform in the most demanding industrial environments worldwide.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-slate-100 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: '6+', label: 'Industries served' },
            { num: '40+', label: 'Countries exported' },
            { num: '500+', label: 'Valve products' },
            { num: '25+', label: 'Years experience' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[32px] font-medium text-[#1e3a5f] leading-none mb-1">
                {s.num}
              </div>
              <div className="text-[12px] text-slate-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Industries grid */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((ind) => {
              const Icon = ind.icon
              return (
                <div
                  key={ind.num}
                  className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${ind.bg} border border-white/10 p-7 flex flex-col gap-5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
                  style={{ background: '#0f172a' }}
                >
                  {/* Number */}
                  <div className="text-[11px] font-medium tracking-widest uppercase"
                    style={{ color: ind.color + '80' }}>
                    {ind.num}
                  </div>

                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: ind.color + '15' }}
                  >
                    <Icon size={22} style={{ color: ind.color }} />
                  </div>

                  {/* Content */}
                  <div>
                    <h2
                      className="text-[20px] font-medium mb-3"
                      style={{ color: '#f1f5f9' }}
                    >
                      {ind.name}
                    </h2>
                    <p className="text-[13px] text-slate-400 leading-relaxed mb-5">
                      {ind.desc}
                    </p>

                    {/* Valve tags */}
                    <div className="flex flex-wrap gap-2">
                      {ind.valves.map((valve) => (
                        <span
                          key={valve}
                          className="text-[11px] px-2.5 py-1 rounded-md border font-medium"
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

                  {/* Arrow */}
                  <div
                    className="flex items-center gap-1.5 text-[12px] mt-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: ind.color }}
                  >
                    View related products
                    <IconArrowRight size={13} />
                  </div>

                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
                    style={{
                      boxShadow: `inset 0 0 60px ${ind.color}10`,
                      border: `1px solid ${ind.color}30`,
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why choose section */}
      <section className="py-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] text-blue-500 uppercase tracking-widest font-medium mb-3">
              Why choose us
            </p>
            <h2 className="text-[28px] font-medium text-slate-900 tracking-tight mb-6">
              Built for the most demanding applications
            </h2>
            <p className="text-[14px] text-slate-500 leading-relaxed mb-8">
              Every valve we manufacture is tested under conditions that exceed the requirements of its intended application — ensuring zero failure in the field.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { title: 'Pressure tested', desc: 'Every unit hydro-tested before dispatch' },
                { title: 'Material certified', desc: 'Mill test certificates for all materials' },
                { title: 'Global standards', desc: 'API, ISO, BS, ANSI, DIN compliance' },
                { title: 'Custom engineered', desc: 'Special alloys and sizes on request' },
              ].map((point) => (
                <div
                  key={point.title}
                  className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-[13px] font-medium text-slate-900 mb-0.5">
                      {point.title}
                    </div>
                    <div className="text-[12px] text-slate-400">
                      {point.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div className="bg-[#0f172a] rounded-2xl p-8 flex flex-col gap-6">
            <div>
              <h3 className="text-[22px] font-medium text-white mb-3">
                Have a specific application?
              </h3>
              <p className="text-[13px] text-slate-400 leading-relaxed">
                Tell us about your process conditions — pressure, temperature, media, flow rate — and our engineers will recommend the right valve solution.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="/contact"
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-[14px] font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Discuss your application
                <IconArrowRight size={15} />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-[14px] font-medium px-6 py-3 rounded-xl transition-colors"
              >
                WhatsApp our engineers
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}