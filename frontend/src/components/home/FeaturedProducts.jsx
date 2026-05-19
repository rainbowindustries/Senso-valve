'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  IconChevronLeft,
  IconChevronRight,
  IconArrowRight,
} from '@tabler/icons-react'

export default function FeaturedProducts({ products = [] }) {
  const [swiper, setSwiper] = useState(null)

  // If no products yet show placeholder message
  if (products.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-[14px]">
            No featured products yet.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #1e3a5f 100%)'
    }}>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <p className="text-[11px] text-blue-300 uppercase tracking-widest font-medium mb-2">
          Product range
        </p>
        <h2 className="text-[28px] font-medium text-white tracking-tight">
          Valve categories
        </h2>
      </div>

      {/* Slider */}
      <div className="relative max-w-5xl mx-auto px-14">

        {/* Left Arrow */}
        <button
          onClick={() => swiper?.slidePrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          <IconChevronLeft size={32} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => swiper?.slideNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          <IconChevronRight size={32} />
        </button>

        <Swiper
          modules={[Pagination]}
          onSwiper={setSwiper}
          spaceBetween={20}
          slidesPerView={1.15}
          centeredSlides={true}
          pagination={{ clickable: true, el: '.feat-pagination' }}
          breakpoints={{
            768:  { slidesPerView: 1.3, spaceBetween: 24 },
            1024: { slidesPerView: 1.4, spaceBetween: 28 },
          }}
          className="!overflow-visible"
        >
          {products.map((p) => (
            <SwiperSlide key={p.id}>
              {({ isActive }) => (
                <Link href={`/products/${p.slug}`}>
                  <div
                    className={`rounded-2xl overflow-hidden transition-all duration-500 ${
                      isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
                    }`}
                    style={{ background: '#1a1f2e', height: '460px' }}
                  >
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-6 pt-5 pb-2">
                      <div className="flex flex-col gap-0.5">
                        <div className="w-4 h-0.5 bg-white/50 rounded" />
                        <div className="w-4 h-0.5 bg-white/50 rounded" />
                        <div className="w-4 h-0.5 bg-white/50 rounded" />
                      </div>
                      <div className="text-[11px] text-white/30 tracking-widest uppercase">
                        {p.categories?.name || 'Manual'}
                      </div>
                    </div>

                    {/* Product image or placeholder */}
                    <div className="flex items-center justify-center" style={{ height: '260px' }}>
                      {p.images && p.images.length > 0 ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          width={240}
                          height={240}
                          className="object-contain h-full w-auto"
                        />
                      ) : (
                        <div className="w-40 h-40 rounded-full bg-white/5 flex items-center justify-center">
                          <span className="text-white/20 text-[12px]">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom info */}
                    <div className="px-6 pb-6">
                      {/* Tags from specifications */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">
                          Tags
                        </span>
                        <div className="flex-1 h-px bg-white/10" />
                      </div>
                      <div className="flex gap-2 flex-wrap mb-4">
                        {p.specifications && Object.values(p.specifications)
                          .slice(0, 3)
                          .map((val, i) => (
                            <span
                              key={i}
                              className="text-[11px] border border-white/20 text-white/60 px-3 py-1 rounded-md"
                            >
                              {val}
                            </span>
                          ))
                        }
                      </div>

                      {/* Product name */}
                      <h3 className="text-[32px] font-semibold text-white tracking-tight leading-none">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-2 text-[12px] text-white/30 group-hover:text-blue-400 transition-colors">
                        <span>View specs</span>
                        <IconArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Pagination dots */}
      <div className="feat-pagination flex justify-center gap-2 mt-8" />

      <style jsx global>{`
        .feat-pagination .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: rgba(255,255,255,0.3);
          opacity: 1;
          border-radius: 9999px;
          display: inline-block;
          transition: all 0.3s;
        }
        .feat-pagination .swiper-pagination-bullet-active {
          background: #fff;
          width: 20px;
          border-radius: 4px;
        }
      `}</style>

    </section>
  )
}