'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  IconChevronRight,
  IconBrandWhatsapp,
  IconFileDownload,
  IconMaximize,
  IconX,
} from '@tabler/icons-react'

// Custom intersection observer hook for staggered fade-in animations
function useFadeIn() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-6')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = ref.current?.querySelectorAll('.fade-in')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return ref
}

export default function ProductClient({ product }) {
  const [activeImage, setActiveImage] = useState(
    product.images?.[0] || null
  )
  const [lightbox, setLightbox] = useState(false)
  const pageRef = useFadeIn()

  return (
    <div ref={pageRef} className="font-sans">

      {/* Breadcrumb + Hero (Matched to slightly dark steel-teal background) */}
      <section className="bg-[#1E4356] py-12 px-6 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/[0.02] rounded-full blur-2xl pointer-events-none translate-x-1/4 translate-y-1/4" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-[12px] text-white/50 mb-4 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors duration-200">
              Home
            </Link>
            <IconChevronRight size={11} className="text-white/30" />
            <Link href="/products" className="hover:text-white transition-colors duration-200">
              Products
            </Link>
            <IconChevronRight size={11} className="text-white/30" />
            <span className="text-white/70">
              {product.categories?.name}
            </span>
            <IconChevronRight size={11} className="text-white/30" />
            <span className="text-[#FFC299] font-semibold">{product.name}</span>
          </div>
          <h1 className="text-[32px] md:text-[38px] font-extrabold text-white tracking-tight leading-tight">
            {product.name}
          </h1>
          <p className="text-[13px] text-white/60 mt-2 font-medium">
            {product.categories?.name}
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Left Column — Images and Gallery */}
            <div className="fade-in opacity-0 translate-y-6 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]">

              {/* Main Image View */}
              <div
                className="relative bg-[#FAFAF9] rounded-2xl border border-[#E5E2DC] overflow-hidden mb-4 group flex items-center justify-center"
                style={{ height: '420px' }}
              >
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={product.name}
                    fill
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-[13px] italic">
                    No image available
                  </div>
                )}

                {/* Fullscreen Expansion button */}
                {activeImage && (
                  <button
                    onClick={() => setLightbox(true)}
                    className="absolute bottom-4 right-4 w-9 h-9 bg-white/95 hover:bg-white border border-[#E5E2DC] rounded-lg flex items-center justify-center shadow-md transition-all duration-300"
                  >
                    <IconMaximize size={15} className="text-slate-600" />
                  </button>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 flex-wrap mb-6">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${activeImage === img
                        ? 'border-[#0A8F8A] shadow-md shadow-[#0A8F8A]/10'
                        : 'border-[#E5E2DC] hover:border-[#0A8F8A]/40'
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        fill
                        className="object-contain p-1.5"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <a
                  href={`https://wa.me/919327841813?text=I am interested in ${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-[13px] font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow transition-all duration-200"
                >
                  <IconBrandWhatsapp size={16} strokeWidth={2.2} />
                  WhatsApp Inquiry
                </a>
                {product.pdf_url && (
                  <a
                    href={product.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white border border-[#E5E2DC] hover:border-red-300 text-slate-700 text-[13px] font-semibold px-6 py-3 rounded-xl transition-all duration-200"
                  >
                    <IconFileDownload size={16} className="text-red-500" />
                    Download Datasheet
                  </a>
                )}
              </div>
            </div>

            {/* Right Column — Specifications & Details */}
            <div className="fade-in opacity-0 translate-y-6 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] delay-150 flex flex-col gap-8">

              <div>
                <h2 className="text-[28px] md:text-[32px] font-extrabold text-slate-900 tracking-tight mb-2">
                  {product.name}
                </h2>
                <p className="text-[13.5px] text-[#0A8F8A] font-bold tracking-wide uppercase">
                  {product.categories?.name}
                </p>
              </div>

              {/* Specs Table */}
              {product.specifications &&
                Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Technical Specifications
                    </h3>
                    <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
                      {Object.entries(product.specifications).map(
                        ([key, value], i) => (
                          <div
                            key={key}
                            className={`flex items-start gap-4 px-5 py-4 border-b border-slate-100 last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF9]'
                              }`}
                          >
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide w-2/5 flex-shrink-0 pt-0.5">
                              {key.replace(/_/g, ' ')}
                            </div>
                            <div className="text-[13px] text-slate-800 font-bold">
                              {value}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Product Description */}
              {product.description && (
                <div className="fade-in opacity-0 translate-y-6 transition-all duration-[800ms] delay-200">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Description
                  </h3>
                  <p className="text-[14px] text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Enquiry Card CTA */}
              <div className="fade-in opacity-0 translate-y-6 transition-all duration-[800ms] delay-250 bg-gradient-to-br from-[#1E4356] to-[#042422] rounded-2xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/[0.01] rounded-full blur-xl pointer-events-none" />
                <h4 className="text-[17px] font-bold text-white mb-1.5 relative z-10">
                  Interested in this product?
                </h4>
                <p className="text-[12.5px] text-white/60 mb-5 relative z-10">
                  Get full technical specifications, catalogs, and customized pricing from our engineering team.
                </p>
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}&product_id=${product.id}`}
                  className="flex items-center justify-center gap-2 bg-[#0A8F8A] hover:bg-[#087C77] text-white text-[13px] font-bold px-5 py-3 rounded-xl shadow-md transition-colors duration-300 w-full relative z-10"
                >
                  Send Inquiry
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Image Lightbox View */}
      {lightbox && activeImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightbox(false)}
        >
          {/* Close Lightbox Button */}
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <IconX size={20} color="#fff" />
          </button>

          {/* Expanded Image */}
          <div
            className="relative w-full max-w-4xl"
            style={{ maxHeight: '75vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={product.name}
              width={1200}
              height={900}
              className="object-contain w-full rounded-xl"
              style={{ maxHeight: '75vh' }}
            />
          </div>

          {/* Lightbox thumbnail strip */}
          {product.images && product.images.length > 1 && (
            <div
              className="flex gap-2 mt-4"
              onClick={(e) => e.stopPropagation()}
            >
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === img
                    ? 'border-white'
                    : 'border-white/20 hover:border-white/60'
                    }`}
                >
                  <Image
                    src={img}
                    alt={`thumbnail ${i + 1}`}
                    width={56}
                    height={56}
                    className="object-contain w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
