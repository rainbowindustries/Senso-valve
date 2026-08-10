import GalleryClient from './GalleryClient'

export const dynamic = 'force-dynamic'

// Fetch Gallery Images Server-Side
async function getGalleryImages() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
    const res = await fetch(`${apiUrl}/gallery`, { cache: 'no-store' })
    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Failed to fetch gallery images:', error)
    return []
  }
}

export const metadata = {
  title: 'Gallery -',
  description: 'View photos of our industrial valve manufacturing facility in Rajkot, CNC machinery, quality testing lab, and manufactured Ball, Gate, Globe, Check, and Butterfly Valves.',
  keywords: [
    'valve factory gallery',
    'industrial valve manufacturing photos',
    'valve testing laboratory Rajkot',
    'CNC valve machinery photos',
  ],
  alternates: {
    canonical: '/gallery',
  },
}

export default async function GalleryPage() {
  const images = await getGalleryImages()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vertexvalve.com'

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Gallery',
        item: `${siteUrl}/gallery`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <GalleryClient initialImages={images} />
    </>
  )
}

