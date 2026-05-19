import {
  IconFileTypePdf,
  IconDownload,
  IconEye,
} from '@tabler/icons-react'

async function getCatalogues() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/catalogues`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Failed to fetch catalogues:', error)
    return []
  }
}

export const metadata = {
  title: 'Catalogue | Hammer Valve Industries',
  description: 'Download product catalogues and technical datasheets for our industrial valve range.',
}

export default async function CataloguePage() {
  const catalogues = await getCatalogues()

  return (
    <main>

      {/* Hero */}
      <section className="bg-[#0f172a] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] text-blue-500 uppercase tracking-widest font-medium mb-3">
            Catalogue
          </p>
          <h1 className="text-[36px] font-medium text-white tracking-tight mb-4">
            Product catalogues
          </h1>
          <p className="text-[15px] text-slate-400 max-w-xl leading-relaxed">
            Download our technical datasheets and product catalogues for detailed specifications.
          </p>
        </div>
      </section>

      {/* Catalogues grid */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">

          {catalogues.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconFileTypePdf size={28} className="text-slate-300" />
              </div>
              <h3 className="text-[16px] font-medium text-slate-900 mb-2">
                No catalogues yet
              </h3>
              <p className="text-[13px] text-slate-400">
                Catalogues will appear here once uploaded.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {catalogues.map((cat) => (
                <div
                  key={cat.id}
                  className="border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  {/* PDF preview area */}
                  <div className="bg-slate-50 h-44 flex flex-col items-center justify-center border-b border-slate-100 gap-3">
                    <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center">
                      <IconFileTypePdf size={32} className="text-red-400" />
                    </div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                      PDF Document
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-[15px] font-medium text-slate-900 mb-1">
                      {cat.title}
                    </h3>
                    {cat.description && (
                      <p className="text-[12px] text-slate-400 mb-4 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                    {cat.products && (
                      <p className="text-[11px] text-blue-500 mb-4">
                        Related: {cat.products.name}
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <a
                        href={cat.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[12px] text-blue-500 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <IconEye size={13} />
                        View
                      </a>
                      <a
                        href={cat.file_url}
                        download
                        className="flex items-center gap-1.5 text-[12px] text-white bg-[#1e3a5f] hover:bg-[#162d4a] px-3 py-2 rounded-lg transition-colors"
                      >
                      
                        <IconDownload size={13} />
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

      {/* CTA */}
      <section className="py-14 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-[20px] font-medium text-slate-900 mb-2">
              Need a specific datasheet?
            </h3>
            <p className="text-[13px] text-slate-400">
              Contact us and we will send you the technical documentation you need.
            </p>
          </div>
          <a
            href="/contact"
            className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-[13px] font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
          >
            Request datasheet
          </a>
        </div>
      </section>

    </main>
  )
}