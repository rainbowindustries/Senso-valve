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

function FadeUp({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                     transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function GalleryPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`)
      .then(r => r.json())
      .then(d => setImages(d.data || []))
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
    <main className="bg-white">

      {/* Hero */}
      <section className="bg-[#1a2e44] py-16 px-5 sm:px-8 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <FadeUp delay={0}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-0.5 bg-[#4A7FA5] rounded-full" />
              <span className="text-[11px] font-medium text-[#4A7FA5] uppercase tracking-[2px]">
                Gallery
              </span>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <h1 className="text-[32px] sm:text-[40px] font-bold text-white tracking-tight mb-4">
              Our facility & products
            </h1>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="text-[15px] text-white/55 max-w-xl leading-relaxed">
              A look inside our manufacturing facility, quality control lab and product range.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-16 px-5 sm:px-8 lg:px-10 bg-[#FAFAF8]">
        <div className="max-w-[1280px] mx-auto">

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-[#1a2e44]/30 border-t-[#1a2e44] rounded-full animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconPhoto size={28} className="text-slate-300" />
              </div>
              <h3 className="text-[16px] font-semibold text-slate-900 mb-2">No images yet</h3>
              <p className="text-[13px] text-slate-400">
                Gallery images will appear here once uploaded by the team.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <FadeUp key={img.id} delay={i * 40}>
                  <div
                    onClick={() => openLightbox(img)}
                    className="relative group cursor-pointer rounded-xl overflow-hidden border border-[#E5E2DC] hover:border-[#C8D4E0] hover:shadow-lg hover:shadow-black/5 transition-all duration-300 aspect-square bg-white"
                  >
                    <div className="absolute inset-0 p-3">
                      <div className="relative w-full h-full">
                        <Image
                          src={img.image_url}
                          alt={img.name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <IconZoomIn size={18} className="text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 py-3.5">
                      <span className="text-[15px] sm:text-[16px] font-bold text-white leading-tight line-clamp-1 drop-shadow-md">
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

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4"
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
              alt={lightbox.name}
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