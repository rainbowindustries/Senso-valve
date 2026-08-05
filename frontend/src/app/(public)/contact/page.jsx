import ContactClient from './ContactClient'

export const metadata = {
  title: 'Contact -',
  description: 'Contact Vertex Valve (Rainbow Industries) for industrial valve inquiries, technical datasheets, valve quotes, and custom valve manufacturing requests in Rajkot, Gujarat.',
  keywords: [
    'contact vertex valve',
    'industrial valve inquiry',
    'valve price quote',
    'valve manufacturer contact Rajkot',
    'buy ball valves India',
  ],
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
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
        name: 'Contact Us',
        item: `${siteUrl}/contact`,
      },
    ],
  }

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Vertex Valve',
    url: `${siteUrl}/contact`,
    description: 'Get in touch with Vertex Valve engineering team for technical inquiries and custom industrial valve quotes.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <ContactClient />
    </>
  )
}