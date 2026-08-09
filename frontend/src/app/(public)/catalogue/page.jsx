import {
  IconFileTypePdf,
  IconDownload,
  IconEye,
} from '@tabler/icons-react'

// Fetch Catalogues Server-Side
async function getCatalogues() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
    const res = await fetch(
      `${apiUrl}/catalogues`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Failed to fetch catalogues:', error)
    return []
  }
}

export const dynamic = 'force-dynamic'

// Page Metadata
export const metadata = {
  title: 'Catalogues -',
  description: 'Download official product catalogues, dimensions, pressure charts, and technical engineering datasheets for Ball Valves, Gate Valves, Globe Valves, Check Valves, and Butterfly Valves.',
  keywords: [
    'industrial valve catalogue',
    'valve PDF datasheets',
    'ball valve specifications PDF',
    'gate valve dimensions chart',
    'butterfly valve catalogue download',
    'check valve engineering manual',
  ],
  alternates: {
    canonical: '/catalogue',
  },
}


export default async function CataloguePage() {
  const catalogues = await getCatalogues()

  return (
    <main className="bg-white font-sans min-h-screen">

      {/* ── Injection of NATIVE FADE-IN CSS (No client-side JS overhead) ── */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
      ` }} />

      {/* Hero Section */}
      <section className="bg-[#1E4356] py-16 px-6 md:px-10 relative overflow-hidden">
        {/* Subtle decorative background gradients */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
        <div className="absolute left-10 top-5 w-40 h-40 bg-[#EF8135]/[0.05] rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-0.5 bg-[#EF8135] rounded-full" /> {/* Orange Accent */}
            <span className="text-[11px] font-bold text-white/80 uppercase tracking-[2.5px]">
              Catalogue
            </span>
          </div>
          <h1 className="text-[36px] md:text-[42px] font-extrabold text-white tracking-tight leading-tight mb-4">
            Product Catalogues
          </h1>
          <p className="text-[15px] sm:text-[16px] text-white/80 max-w-xl leading-relaxed">
            Download our technical datasheets and product catalogues for detailed engineering specifications.
          </p>
        </div>
      </section>

      {/* Catalogues grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">

          {catalogues.length === 0 ? (
            <div className="text-center py-20 animate-fade-up delay-100">
              <div className="w-16 h-16 bg-[#FAFAF8] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <IconFileTypePdf size={28} className="text-slate-350" />
              </div>
              <h3 className="text-[16px] font-bold text-slate-800 mb-2">
                No catalogues yet
              </h3>
              <p className="text-[13.5px] text-slate-400">
                Catalogues will appear here once uploaded.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogues.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="group relative border border-[#E5E2DC] rounded-2xl overflow-hidden bg-white p-0 flex flex-col justify-between transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:border-[#0A8F8A]/45 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-[#0A8F8A]/5 animate-fade-up"
                  style={{ animationDelay: `${(idx % 3) * 80 + 100}ms` }}
                >
                  {/* Top thin accent light border on hover */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent group-hover:bg-[#0A8F8A] transition-all duration-[600ms]" />

                  <div>
                    {/* PDF Preview Frame */}
                    <div className="bg-[#FAFAF9] h-44 flex flex-col items-center justify-center border-b border-slate-100 gap-3 relative overflow-hidden">
                      <div className="w-16 h-16 bg-red-50/80 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm transition-transform duration-500 group-hover:scale-105">
                        <IconFileTypePdf size={32} className="text-red-500 animate-pulse" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        PDF Document
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-6">
                      <h3 className="text-[15.5px] font-bold text-slate-800 leading-snug tracking-tight mb-2 transition-colors duration-300 group-hover:text-[#0A8F8A]">
                        {cat.title}
                      </h3>
                      {cat.description && (
                        <p className="text-[12.5px] text-slate-500 mb-4 leading-relaxed font-light">
                          {cat.description}
                        </p>
                      )}
                      {cat.products && (
                        <p className="text-[11.5px] text-[#0A8F8A] font-semibold mb-4">
                          Related: {cat.products.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="px-6 pb-6 mt-auto">
                    <div className="flex gap-3">
                      <a
                        href={cat.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 text-[12px] text-[#0A8F8A] font-bold border border-[#0A8F8A]/30 px-3 py-2.5 rounded-xl hover:bg-[#0A8F8A]/5 transition-colors duration-200"
                      >
                        <IconEye size={13} strokeWidth={2.5} />
                        View
                      </a>
                      <a
                        href={cat.file_url}
                        download
                        className="flex-1 flex items-center justify-center gap-1.5 text-[12px] text-white font-bold bg-[#0A8F8A] hover:bg-[#087C77] px-3 py-2.5 rounded-xl shadow-sm hover:shadow transition-colors duration-200"
                      >
                        <IconDownload size={13} strokeWidth={2.5} />
                        Download
                      </a>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}