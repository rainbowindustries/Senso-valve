import Link from 'next/link'
import Image from 'next/image'
import { IconArrowRight, IconFilter } from '@tabler/icons-react'

async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export const metadata = {
  title: 'Products | Hammer Valve Industries',
  description: 'Browse our complete range of industrial valves and automation products.',
}

export default async function ProductsPage() {
  const categories = await getCategories()

  return (
    <main>

      {/* Hero */}
      <section className="bg-[#0f172a] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] text-blue-500 uppercase tracking-widest font-medium mb-3">
            Products
          </p>
          <h1 className="text-[36px] font-medium text-white tracking-tight mb-4">
            Our product range
          </h1>
          <p className="text-[15px] text-slate-400 max-w-xl leading-relaxed">
            Industrial valve products engineered for critical applications across oil & gas, pharma, water treatment and power sectors.
          </p>
        </div>
      </section>

      {/* Products by category */}
      {categories.length === 0 ? (
        <section className="py-20 px-6 text-center">
          <p className="text-slate-400">No products found.</p>
        </section>
      ) : (
        categories.map((cat) => (
          <section key={cat.id} className="py-14 px-6 border-b border-slate-100 bg-white">
            <div className="max-w-7xl mx-auto">

              {/* Category header */}
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-[22px] font-medium text-slate-900 tracking-tight">
                    {cat.name}
                  </h2>
                  <p className="text-[13px] text-slate-400 mt-1">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Products grid */}
              {cat.products && cat.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {cat.products.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      className="group border border-slate-200 rounded-xl overflow-hidden hover:border-blue-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 bg-white"
                    >
                      {/* Product image */}
                      <div className="bg-slate-50 h-48 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
                        {p.images && p.images.length > 0 ? (
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            width={200}
                            height={200}
                            className="object-contain h-40 w-auto group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-slate-400 text-[11px]">No image</span>
                          </div>
                        )}
                        <span className="absolute top-3 left-3 text-[10px] bg-[#1e3a5f] text-blue-300 px-2.5 py-1 rounded font-medium">
                          {cat.name}
                        </span>
                      </div>

                      {/* Product info */}
                      <div className="p-4">
                        <h3 className="text-[14px] font-medium text-slate-900 mb-3">
                          {p.name}
                        </h3>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="text-[12px] text-blue-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                            <IconArrowRight size={12} />
                            View specs
                          </span>
                          {p.featured && (
                            <span className="text-[10px] text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-[13px]">
                  No products in this category yet.
                </p>
              )}
            </div>
          </section>
        ))
      )}

      {/* CTA */}
      <section className="py-14 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-[20px] font-medium text-slate-900 mb-2">
              Can't find what you need?
            </h3>
            <p className="text-[13px] text-slate-400">
              We manufacture custom valve solutions. Contact our engineering team.
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
            <Link
              href="/contact"
              className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-[13px] font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Send enquiry
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}