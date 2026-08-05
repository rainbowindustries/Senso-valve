import ApplicationClient from './ApplicationClient'

export const metadata = {
  title: 'Application -',
  description: 'Explore industrial valve applications for Oil & Gas, Water Treatment, Power Plants, Chemical Processing, and Pharma. High-performance Ball Valves, Gate Valves, Globe Valves, Check Valves, and Butterfly Valves.',
  keywords: [
    'industrial valve applications',
    'oil and gas valves',
    'water treatment valves',
    'power plant valves',
    'chemical process valves',
    'pharma sanitary valves',
    'high pressure valve applications',
  ],
  alternates: {
    canonical: '/application',
  },
}

export default function ApplicationPage() {
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
        name: 'Applications',
        item: `${siteUrl}/application`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ApplicationClient />
    </>
  )
}
