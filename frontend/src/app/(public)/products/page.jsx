import Link from 'next/link'
import Image from 'next/image'
import { IconArrowRight, IconSearch, IconX } from '@tabler/icons-react'

// Fetch Categories Server-Side
async function getCategories() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
    const res = await fetch(
      `${apiUrl}/categories`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export const dynamic = 'force-dynamic'

// Page Metadata
export const metadata = {
  title: 'Products - Vertex Valve',
  description: 'Browse our complete catalog of industrial valves manufactured in India. Certified Ball Valves, Gate Valves, Globe Valves, Check Valves, Butterfly Valves, and automated flow control systems.',
  keywords: [
    'industrial valves catalogue',
    'ball valve catalog',
    'gate valve manufacturer catalog',
    'butterfly valve specifications',
    'check valve sizes',
    'globe valve pressure ratings',
    'industrial valve products',
  ],
  alternates: {
    canonical: '/products',
  },
}

export default async function ProductsPage({ searchParams }) {
  const categories = await getCategories()
  const params = await searchParams
  const searchQuery = (params?.search || '').trim().toLowerCase()

  // Filter products by search query if present
  const filteredCategories = categories.map(cat => {
    if (!searchQuery) return cat
    const matchingProducts = (cat.products || []).filter(p =>
      p.name?.toLowerCase().includes(searchQuery) ||
      p.description?.toLowerCase().includes(searchQuery)
    )
    return { ...cat, products: matchingProducts }
  }).filter(cat => !searchQuery || cat.products.length > 0)

  const hasAnyProducts = filteredCategories.some(cat => cat.products && cat.products.length > 0)

  return (
    <main className="bg-white font-sans min-h-screen">

      {/* ── Injection of NATIVE FADE-IN CSS ── */}
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
      <section className="bg-[#1E4356] py-16 sm:py-20 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
        <div className="absolute left-10 top-5 w-40 h-40 bg-[#EF8135]/[0.05] rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-0.5 bg-[#EF8135] rounded-full" />
            <span className="text-[11px] font-bold text-white/80 uppercase tracking-[2.5px]">
              Products
            </span>
          </div>
          <h1 className="text-[36px] md:text-[42px] font-extrabold text-white tracking-tight leading-tight mb-4">
            Our Product Range
          </h1>
          <p className="text-[15px] sm:text-[16px] text-white/80 max-w-xl leading-relaxed">
            Industrial valve solutions engineered for critical applications across oil & gas, pharma, water treatment, and power sectors.
          </p>
        </div>
      </section>

      {/* Products by Category */}
      {!hasAnyProducts ? (
        <section className="py-20 px-6 text-center bg-[#FAFAF8] animate-fade-up delay-100">
          <div className="max-w-md mx-auto">
            <h3 className="text-[18px] font-bold text-slate-800 mb-2">
              {searchQuery ? `No products matching "${params?.search}"` : 'No products found'}
            </h3>
            <p className="text-slate-500 text-[14px] mb-6">
              Try searching with another keyword or explore all our valve categories.
            </p>
            {searchQuery && (
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#0A8F8A] text-white px-5 py-2.5 rounded-xl font-bold text-[13.5px] no-underline shadow-sm hover:bg-[#087773] transition-colors"
              >
                View All Products
              </Link>
            )}
          </div>
        </section>
      ) : (
        filteredCategories.map((cat, catIdx) => (
          <section
            key={cat.id}
            className="py-16 px-6 border-b border-slate-200/60 bg-white last:border-b-0 animate-fade-up"
            style={{ animationDelay: `${(catIdx + 1) * 150}ms` }}
          >
            <div className="max-w-7xl mx-auto">

              {/* Category Header */}
              <div className="flex items-end justify-between mb-8 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-[22px] md:text-[24px] font-bold text-slate-900 tracking-tight">
                    {cat.name}
                  </h2>
                  <p className="text-[13px] text-slate-500 mt-1">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Products Grid */}
              {cat.products && cat.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {cat.products.map((p, pIdx) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      className="group relative border border-[#E5E2DC] rounded-2xl overflow-hidden bg-white p-0 flex flex-col justify-between transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:border-[#0A8F8A]/45 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-[#0A8F8A]/5 animate-fade-up"
                      style={{ animationDelay: `${(pIdx % 4) * 80 + 100}ms` }}
                    >
                      {/* Accent highlight bar on hover */}
                      <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent group-hover:bg-[#0A8F8A] transition-all duration-[600ms]" />

                      <div>
                        {/* Image Frame */}
                        <div className="bg-[#FAFAF9] h-52 flex items-center justify-center border-b border-slate-100 relative overflow-hidden p-4">
                          {p.images && p.images.length > 0 ? (
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              width={200}
                              height={200}
                              className="object-contain h-40 w-auto transform transition-all duration-500 group-hover:scale-[1.06] group-hover:rotate-1"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-slate-200/60 rounded-full flex items-center justify-center">
                              <span className="text-slate-400 text-[11px] font-medium">No image</span>
                            </div>
                          )}
                          <span className="absolute top-3 left-3 text-[10px] bg-[#1E4356] text-[#FFC299] px-2.5 py-1 rounded-md font-semibold tracking-wide shadow-sm">
                            {cat.name}
                          </span>
                        </div>

                        {/* Text info */}
                        <div className="p-5">
                          <h3 className="text-[14.5px] font-bold text-slate-800 leading-snug tracking-tight mb-4 transition-colors duration-300 group-hover:text-[#0A8F8A]">
                            {p.name}
                          </h3>
                        </div>
                      </div>

                      {/* Card Footer specs indicator */}
                      <div className="px-5 pb-5 mt-auto">
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <span className="text-[12.5px] text-[#0A8F8A] font-semibold flex items-center gap-1 transition-all duration-300 group-hover:gap-2 group-hover:text-[#EF8135]">
                            <IconArrowRight size={13} strokeWidth={2.5} />
                            View specs
                          </span>
                          {p.featured && (
                            <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-[13px] italic">
                  No products in this category yet.
                </p>
              )}
            </div>
          </section>
        ))
      )}
    </main>
  )
}