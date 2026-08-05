import GalleryClient from './GalleryClient'

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

export default function GalleryPage() {
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
      <GalleryClient />
    </>
  )
}
