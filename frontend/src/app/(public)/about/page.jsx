import AboutClient from './AboutClient'

export const metadata = {
  title: 'About Us - ',
  description: 'Learn about Vertex Valve (Rainbow Industries), trusted industrial valve manufacturer since 2001 in Rajkot, Gujarat. ISO 9001:2015 certified exporter of Ball Valves, Gate Valves, Globe Valves, Check Valves, and Butterfly Valves.',
  keywords: [
    'about vertex valve',
    'valve manufacturer history',
    'Rainbow Industries Rajkot',
    'industrial valve engineering',
    'certified valve manufacturer',
    'ISO 9001 valve company',
    'API 6D valve manufacturer',
  ],
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
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
        name: 'About Us',
        item: `${siteUrl}/about`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutClient />
    </>
  )
}
