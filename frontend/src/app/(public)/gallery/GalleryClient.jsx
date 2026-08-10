'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconZoomIn,
  IconPhoto,
} from '@tabler/icons-react'
import { useInView } from 'react-intersection-observer'

// ─── FadeUp Animation Component ─────────────────────
function FadeUp({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
                     transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function GalleryClient({ initialImages = [] }) {
  const [images, setImages] = useState(initialImages)
  const [loading, setLoading] = useState(initialImages.length === 0)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
    fetch(`${apiUrl}/gallery`)
      .then(r => r.json())
      .then(d => {
        if (d.data && d.data.length > 0) {
          setImages(d.data)
        }
      })
      .catch(err => console.error('Failed to fetch gallery:', err))
      .finally(() => setLoading(false))
  }, [])

  const openLightbox = (img) => {
    const index = images.findIndex(i => i.id === img.id)
    setLightbox({ ...img, index })
  }
  const closeLightbox = () => setLightbox(null)

  const prevImage = () => {
    if (lightbox.index > 0) {
      const prev = images[lightbox.index - 1]
      setLightbox({ ...prev, index: lightbox.index - 1 })
    }
  }
  const nextImage = () => {
    if (lightbox.index < images.length - 1) {
      const next = images[lightbox.index + 1]
      setLightbox({ ...next, index: lightbox.index + 1 })
    }
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightbox) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox])

  return (
    <main className="bg-white min-h-screen">

      {/* Hero Section */}
      <section className="bg-[#1E4356] py-16 px-5 sm:px-8 lg:px-10 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
        <div className="absolute left-10 top-5 w-40 h-40 bg-[#EF8135]/[0.05] rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto relative z-10">
          <FadeUp delay={0}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-0.5 bg-[#EF8135] rounded-full" />
              <span className="text-[11px] font-bold text-white/80 uppercase tracking-[2.5px]">
                Gallery
              </span>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <h1 className="text-[36px] md:text-[42px] font-extrabold text-white tracking-tight leading-tight mb-4">
              Products Gallery
            </h1>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="text-[15px] sm:text-[16px] text-white/80 max-w-xl leading-relaxed">
              Browse our complete range of industrial valve products through detailed images, highlighting quality engineering, robust construction, and exceptional performance.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-16 px-5 sm:px-8 lg:px-10 bg-[#FAFAF8]">
        <div className="max-w-[1280px] mx-auto">

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-4 border-[#0A8F8A]/30 border-t-[#0A8F8A] rounded-full animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-24 animate-fade-up delay-100">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-150 shadow-sm">
                <IconPhoto size={28} className="text-slate-350" />
              </div>
              <h3 className="text-[16px] font-bold text-slate-800 mb-2">No images yet</h3>
              <p className="text-[13.5px] text-slate-400">
                Gallery images will appear here once uploaded by the team.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {images.map((img, i) => (
                <FadeUp key={img.id} delay={i * 40}>
                  <div
                    onClick={() => openLightbox(img)}
                    className="group relative cursor-pointer rounded-2xl overflow-hidden border border-[#E5E2DC] bg-white aspect-square shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#0A8F8A]/45 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0A8F8A]/5"
                  >
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent group-hover:bg-[#0A8F8A] transition-all duration-[600ms]" />

                    <div className="absolute inset-0 p-3 pb-14">
                      <div className="relative w-full h-full">
                        <Image
                          src={img.image_url}
                          alt={img.name || 'Industrial Valve Photo'}
                          fill
                          className="object-contain transform transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-[#0A8F8A]/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                        <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md">
                          <IconZoomIn size={20} className="text-[#0A8F8A]" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3.5 pt-8">
                      <span className="text-[14px] sm:text-[14.5px] font-bold text-white leading-tight line-clamp-1">
                        {img.name}
                      </span>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4 animate-fadeIn"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <IconX size={20} color="#fff" />
          </button>

          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white/50 text-[13px] font-medium z-10">
            {lightbox.index + 1} / {images.length}
          </div>

          {lightbox.index > 0 && (
            <button
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); prevImage() }}
            >
              <IconChevronLeft size={22} color="#fff" />
            </button>
          )}

          <div
            className="relative w-full max-w-5xl"
            style={{ maxHeight: '78vh', height: '78vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.image_url}
              alt={lightbox.name || 'Valve photo preview'}
              fill
              className="object-contain rounded-xl"
            />
          </div>

          <div className="text-center mt-5">
            <p className="text-white text-[20px] sm:text-[22px] font-bold">{lightbox.name}</p>
          </div>

          {lightbox.index < images.length - 1 && (
            <button
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); nextImage() }}
            >
              <IconChevronRight size={22} color="#fff" />
            </button>
          )}
        </div>
      )}

    </main>
  )
}
