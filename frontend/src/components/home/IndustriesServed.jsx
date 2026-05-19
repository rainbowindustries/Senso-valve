import {
  IconFlame,
  IconPill,
  IconDroplet,
  IconBolt,
  IconBuildingFactory,
  IconAnchor
} from '@tabler/icons-react'

const industries = [
  {
    num: '01',
    icon: IconFlame,
    name: 'Oil & gas',
    desc: 'Upstream, midstream and downstream pipeline systems',
  },
  {
    num: '02',
    icon: IconPill,
    name: 'Pharma',
    desc: 'Hygienic valves for sterile process environments',
  },
  {
    num: '03',
    icon: IconDroplet,
    name: 'Water treatment',
    desc: 'Municipal and industrial water distribution networks',
  },
  {
    num: '04',
    icon: IconBolt,
    name: 'Power plants',
    desc: 'High-pressure steam and turbine control systems',
  },
  {
    num: '05',
    icon: IconBuildingFactory,
    name: 'Chemical',
    desc: 'Corrosion-resistant valves for aggressive media',
  },
  {
    num: '06',
    icon: IconAnchor,
    name: 'Marine',
    desc: 'Sea water and ballast system valve solutions',
  },
]

export default function IndustriesServed() {
  return (
    <section className="bg-[#0f172a] py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] text-blue-500 uppercase tracking-widest font-medium mb-2">
            Applications
          </p>
          <h2 className="text-[24px] font-medium text-white tracking-tight">
            Industries we serve
          </h2>
          <p className="text-[13px] text-slate-500 mt-1">
            Critical fluid control solutions trusted across global industrial sectors
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {industries.map((ind) => {
            const Icon = ind.icon
            return (
              <div
                key={ind.num}
                className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 hover:border-blue-500/50 hover:bg-blue-500/[0.05] transition-all duration-200 cursor-pointer group"
              >
                <div className="text-[10px] text-slate-600 font-medium tracking-widest mb-4">
                  {ind.num}
                </div>
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Icon size={20} className="text-blue-400" />
                </div>
                <h3 className="text-[13px] font-medium text-slate-200 mb-2">
                  {ind.name}
                </h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  {ind.desc}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}