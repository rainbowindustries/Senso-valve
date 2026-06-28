'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  IconChevronRight,
  IconBrandWhatsapp,
  IconMail,
  IconFileDownload,
  IconMaximize,
  IconX,
} from '@tabler/icons-react'

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
    <div ref={pageRef}>

      {/* Breadcrumb + Hero */}
      <section className="bg-[#102f79] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-[12px] text-slate-400 mb-4 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <IconChevronRight size={12} />
            <Link href="/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <IconChevronRight size={12} />
            <span className="text-slate-300">
              {product.categories?.name}
            </span>
            <IconChevronRight size={12} />
            <span className="text-white">{product.name}</span>
          </div>
          <h1 className="text-[32px] md:text-[38px] font-medium text-white tracking-tight">
            {product.name}
          </h1>
          <p className="text-[13px] text-slate-400 mt-2">
            {product.categories?.name}
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left — Images */}
            <div className="fade-in opacity-0 translate-y-6 transition-all duration-700">

              {/* Main image */}
              <div
                className="relative bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden mb-4 group"
                style={{ height: '420px' }}
              >
                {activeImage ? (
                  <Image
                    src={activeImage}
                    alt={product.name}
                    fill
                    className="object-contain p-6 transition-all duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300 text-[13px]">
                    No image available
                  </div>
                )}

                {/* Fullscreen button */}
                {activeImage && (
                  <button
                    onClick={() => setLightbox(true)}
                    className="absolute bottom-4 right-4 w-9 h-9 bg-white/90 hover:bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <IconMaximize size={15} className="text-slate-600" />
                  </button>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 flex-wrap mb-6">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                        activeImage === img
                          ? 'border-blue-500 shadow-md shadow-blue-100'
                          : 'border-slate-200 hover:border-blue-300'
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

              {/* Action buttons */}
              <div className="flex gap-3 flex-wrap">
                {/* <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}&product_id=${product.id}`}
                  className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  <IconMail size={15} />
                  Email inquiry
                </Link> */}
                <a
                  href={`https://wa.me/919876543210?text=I am interested in ${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-[13px] font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  <IconBrandWhatsapp size={15} />
                  WhatsApp
                </a>
                {product.pdf_url && (
                  <a
                    href={product.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white border border-slate-200 hover:border-red-300 text-slate-700 text-[13px] font-medium px-5 py-2.5 rounded-lg transition-colors"
                  >
                    <IconFileDownload size={15} className="text-red-400" />
                    Datasheet
                  </a>
                )}
              </div>
            </div>

            {/* Right — Specifications */}
            <div className="fade-in opacity-0 translate-y-6 transition-all duration-700 delay-200 flex flex-col gap-6">

              <div>
                <h2 className="text-[28px] font-medium text-slate-900 tracking-tight mb-1">
                  {product.name}
                </h2>
                <p className="text-[13px] text-blue-500">
                  {product.categories?.name}
                </p>
              </div>

              {/* Specs table */}
              {product.specifications &&
                Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-3">
                      Specifications
                    </h3>
                    <div className="border border-slate-100 rounded-xl overflow-hidden">
                      {Object.entries(product.specifications).map(
                        ([key, value], i) => (
                          <div
                            key={key}
                            className={`flex items-start gap-4 px-5 py-3.5 border-b border-slate-100 last:border-b-0 ${
                              i % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                            }`}
                          >
                            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide w-2/5 flex-shrink-0 pt-0.5">
                              {key.replace(/_/g, ' ')}
                            </div>
                            <div className="text-[13px] text-slate-800 font-medium">
                              {value}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Description */}
              {product.description && (
                <div className="fade-in opacity-0 translate-y-6 transition-all duration-700 delay-300">
                  <h3 className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-3">
                    Description
                  </h3>
                  <p className="text-[14px] text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Enquiry CTA */}
              <div className="fade-in opacity-0 translate-y-6 transition-all duration-700 delay-400 bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] rounded-2xl p-6">
                <h4 className="text-[16px] font-medium text-white mb-1">
                  Interested in this product?
                </h4>
                <p className="text-[12px] text-slate-400 mb-5">
                  Get technical specifications and pricing from our team within 24 hours.
                </p>
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}&product_id=${product.id}`}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-medium px-5 py-2.5 rounded-lg transition-colors w-full"
                >
                  Send enquiry
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && activeImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <IconX size={20} color="#fff" />
          </button>

          {/* Main lightbox image */}
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

          {/* Thumbnail strip in lightbox */}
          {product.images && product.images.length > 1 && (
            <div
              className="flex gap-2 mt-4"
              onClick={(e) => e.stopPropagation()}
            >
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === img
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