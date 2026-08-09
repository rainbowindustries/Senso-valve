'use client'
import { useState, useEffect } from 'react'
import { IconFileTypePdf, IconDownload, IconAward, IconCheck } from '@tabler/icons-react'

export default function Certifications() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
    fetch(`${apiUrl}/certificates`)
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          setCertificates(d.data)
        } else {
          setCertificates([])
        }
      })
      .catch(err => {
        console.error('Failed to fetch certificates:', err)
        setCertificates([])
      })
      .finally(() => setLoading(false))
  }, [])

  // Standard industry fallback certifications if dynamic ones are empty
  const defaultCertifications = [
    {
      id: 'iso-9001',
      name: 'ISO 9001:2015 Quality Management System',
      description: 'Certified design, manufacturing, and supply of industrial flow control valves.',
      code: 'ISO 9001',
    },
    {
      id: 'ce-marking',
      name: 'CE Marking & PED 2014/68/EU',
      description: 'Compliant with European Pressure Equipment Directive standards for high-pressure systems.',
      code: 'CE Certified',
    },
    {
      id: 'api-6d',
      name: 'API 6D Pipeline Valve Specification',
      description: 'Monogrammed API compliance for heavy-duty oil & gas ball, gate, and check valves.',
      code: 'API 6D',
    },
    {
      id: 'fire-safe',
      name: 'API 607 Fire Safe Certification',
      description: 'Tested and proven zero-leakage fire safety standard for extreme conditions.',
      code: 'API 607',
    },
  ]

  const displayList = certificates.length > 0 ? certificates : defaultCertifications

  return (
    <section className="py-20 px-5 sm:px-8 lg:px-10 bg-[#FAFAF8] border-t border-slate-200/60 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-[#0A8F8A]/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-[#1E4356]/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#EBF5F4] px-3.5 py-1.5 rounded-full mb-3 border border-[#0A8F8A]/20">
            <IconAward size={16} className="text-[#0A8F8A]" />
            <span className="text-[12px] font-bold text-[#0A8F8A] uppercase tracking-[1.5px]">
              Quality Assurance
            </span>
          </div>
          <h2 className="text-[30px] sm:text-[36px] font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Certified Quality & Compliance
          </h2>
          <p className="text-[14.5px] sm:text-[15.5px] text-slate-600 leading-relaxed">
            Our valves are engineered, manufactured, and rigorously tested in accordance with top global quality standards.
          </p>
        </div>

        {/* Certifications Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-9 h-9 border-3 border-[#0A8F8A]/30 border-t-[#0A8F8A] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayList.map((cert) => (
              <div
                key={cert.id}
                className="group relative bg-white border border-[#E5E2DC] rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-[#0A8F8A]/50 hover:shadow-xl hover:shadow-[#0A8F8A]/5 hover:-translate-y-1"
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#1E4356] rounded-t-2xl group-hover:bg-[#0A8F8A] transition-colors duration-300" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 group-hover:scale-105 transition-transform duration-300">
                      <IconFileTypePdf size={26} strokeWidth={1.6} />
                    </div>
                    <span className="text-[11px] font-bold bg-[#EBF5F4] text-[#0A8F8A] px-2.5 py-1 rounded-md border border-[#0A8F8A]/20">
                      {cert.code || 'Certified'}
                    </span>
                  </div>

                  <h3 className="text-[16px] font-bold text-slate-900 leading-snug tracking-tight mb-2 group-hover:text-[#0A8F8A] transition-colors duration-200">
                    {cert.name}
                  </h3>

                  <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
                    {cert.description || 'Official quality certification document.'}
                  </p>
                </div>

                {cert.file_url ? (
                  <a
                    href={cert.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#1E4356] hover:bg-[#0A8F8A] text-white text-[13px] font-bold no-underline transition-colors duration-200 shadow-sm"
                  >
                    <IconDownload size={15} />
                    Download PDF
                  </a>
                ) : (
                  <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200/60">
                    <IconCheck size={15} />
                    <span>Verified Standard</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}