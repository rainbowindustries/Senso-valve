import {
  IconAward,
  IconUsers,
  IconWorld,
  IconBuildingFactory,
  IconCertificate,
  IconShieldCheck,
  IconRosette,
  IconTarget,
  IconEye,
} from '@tabler/icons-react'

const stats = [
  { num: '25+', label: 'Years of experience' },
  { num: '500+', label: 'Products manufactured' },
  { num: '40+', label: 'Countries exported' },
  { num: '5000+', label: 'Global clients' },
]

const certs = [
  { icon: IconCertificate, name: 'ISO 9001:2015', desc: 'Quality management system' },
  { icon: IconShieldCheck, name: 'API 6D', desc: 'Pipeline valves standard' },
  { icon: IconAward, name: 'IBR Approved', desc: 'Indian boiler regulations' },
  { icon: IconRosette, name: 'CE Marked', desc: 'European conformity' },
]

const team = [
  { name: 'Rajesh Shah', role: 'Managing Director', exp: '30+ years in valve industry' },
  { name: 'Amit Patel', role: 'Technical Director', exp: 'M.E. Mechanical Engineering' },
  { name: 'Priya Mehta', role: 'Export Manager', exp: '15+ years international trade' },
  { name: 'Suresh Kumar', role: 'QC Head', desc: 'ISO certified quality control' },
]

export const metadata = {
  title: 'About Us | Hammer Valve Industries',
  description: 'Learn about Hammer Valve Industries — manufacturer and exporter of industrial valves since 2001, based in Rajkot, Gujarat.',
}

export default function AboutPage() {
  return (
    <main>

      {/* Hero */}
      <section className="bg-[#0f172a] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] text-blue-500 uppercase tracking-widest font-medium mb-4">
            About us
          </p>
          <h1 className="text-[36px] md:text-[44px] font-medium text-white tracking-tight leading-tight max-w-2xl mb-6">
            Engineering precision valves since{' '}
            <span className="text-blue-400">2001</span>
          </h1>
          <p className="text-[15px] text-slate-400 leading-relaxed max-w-2xl">
            Hammer Valve Industries is a Rajkot-based manufacturer and exporter of industrial valves and automation solutions. We serve critical industries across 40+ countries with precision-engineered products backed by global certifications.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[36px] font-medium text-[#1e3a5f] leading-none mb-2">
                {s.num}
              </div>
              <div className="text-[13px] text-slate-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] text-blue-500 uppercase tracking-widest font-medium mb-3">
              Our story
            </p>
            <h2 className="text-[28px] font-medium text-slate-900 tracking-tight mb-6">
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

          {/* Right side — info blocks */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 p-5 border border-slate-100 rounded-xl bg-slate-50">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconTarget size={20} className="text-blue-500" />
              </div>
              <div>
                <div className="text-[14px] font-medium text-slate-900 mb-1">
                  Our mission
                </div>
                <div className="text-[13px] text-slate-500 leading-relaxed">
                  To manufacture precision industrial valves that meet the highest international standards while delivering exceptional value to our global customers.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 border border-slate-100 rounded-xl bg-slate-50">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconEye size={20} className="text-blue-500" />
              </div>
              <div>
                <div className="text-[14px] font-medium text-slate-900 mb-1">
                  Our vision
                </div>
                <div className="text-[13px] text-slate-500 leading-relaxed">
                  To be the most trusted name in industrial valve manufacturing across Asia and beyond, known for quality, reliability and technical expertise.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 border border-slate-100 rounded-xl bg-slate-50">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconBuildingFactory size={20} className="text-blue-500" />
              </div>
              <div>
                <div className="text-[14px] font-medium text-slate-900 mb-1">
                  Manufacturing facility
                </div>
                <div className="text-[13px] text-slate-500 leading-relaxed">
                  50,000 sq. ft. facility at GIDC Estate, Rajkot with CNC machining, pressure testing, NDT lab and ISO-certified quality control.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 px-6 bg-slate-50 border-t border-slate-100" id="certifications">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] text-blue-500 uppercase tracking-widest font-medium mb-3">
            Certifications
          </p>
          <h2 className="text-[28px] font-medium text-slate-900 tracking-tight mb-10">
            Globally certified quality
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certs.map((cert) => {
              const Icon = cert.icon
              return (
                <div
                  key={cert.name}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={24} className="text-blue-500" />
                  </div>
                  <div className="text-[15px] font-medium text-slate-900 mb-1">
                    {cert.name}
                  </div>
                  <div className="text-[13px] text-slate-400">
                    {cert.desc}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] text-blue-500 uppercase tracking-widest font-medium mb-3">
            Our team
          </p>
          <h2 className="text-[28px] font-medium text-slate-900 tracking-tight mb-10">
            Leadership team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member) => (
              <div
                key={member.name}
                className="border border-slate-100 rounded-xl p-6 bg-slate-50"
              >
                <div className="w-14 h-14 bg-[#1e3a5f] rounded-full flex items-center justify-center mb-4">
                  <IconUsers size={24} color="#60a5fa" />
                </div>
                <div className="text-[14px] font-medium text-slate-900 mb-1">
                  {member.name}
                </div>
                <div className="text-[12px] text-blue-500 mb-2">
                  {member.role}
                </div>
                <div className="text-[12px] text-slate-400">
                  {member.exp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#1e3a5f]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-[22px] font-medium text-white mb-2">
              Want to know more about our products?
            </h3>
            <p className="text-[13px] text-slate-400">
              Get in touch with our technical team for specifications and pricing.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white text-[13px] font-medium px-6 py-3 rounded-lg transition-colors"
            >
              WhatsApp us
            </a>
            <a
              href="mailto:info@hammer-valve.com"
              className="bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Contact us
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}