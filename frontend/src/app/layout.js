import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vertexvalve.com'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Vertex Valve | Industrial Valve Manufacturer & Exporter ',
    template: '%s Vertex Valve'
  },
  description: 'Vertex Valve (Rainbow Industries) is a premier industrial valve manufacturer in Rajkot, India. We produce certified high-pressure Ball Valves, Gate Valves, Globe Valves, Check Valves, Butterfly Valves, and custom flow control engineering for Oil & Gas, Water Treatment, Chemical & Power industries.',
  keywords: [
    'valve',
    'valves',
    'industrial valve',
    'industrial valves',
    'valve manufacturer',
    'valve supplier',
    'valve exporter',
    'ball valve',
    'gate valve',
    'globe valve',
    'check valve',
    'butterfly valve',
    'safety valve',
    'high pressure valves',
    'flow control valves',
    'industrial valve manufacturer India',
    'valve manufacturer Rajkot',
    'Rainbow Industries',
    'Vertex Valve'
  ],
  authors: [{ name: 'Vertex Valve (Rainbow Industries)' }],
  creator: 'Vertex Valve',
  publisher: 'Vertex Valve',
  category: 'Industrial Valve Manufacturing',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/VertexValveLogo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/VertexValveLogo.png',
  },
  openGraph: {
    title: 'Vertex Valve | Premier Industrial Valve Manufacturer & Global Exporter',
    description: 'Manufacturer of high-performance Ball Valves, Gate Valves, Globe Valves, Check Valves, and Butterfly Valves for global industrial applications.',
    url: siteUrl,
    siteName: 'Vertex Valve',
    images: [
      {
        url: '/VertexValveLogo.png',
        width: 1200,
        height: 630,
        alt: 'Vertex Valve | Industrial Valve Manufacturer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vertex Valve | Industrial Valve Manufacturer',
    description: 'High performance industrial valves engineered for Oil & Gas, Chemical, Power, and Water industries.',
    images: ['/VertexValveLogo.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Manufacturer'],
    name: 'Vertex Valve',
    legalName: 'Rainbow Industries',
    url: siteUrl,
    logo: `${siteUrl}/VertexValveLogo.png`,
    description: 'Leading industrial valve manufacturer and global exporter of high-precision Ball Valves, Gate Valves, Globe Valves, Check Valves, Butterfly Valves, and custom flow control solutions.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rani industries Estate, Division-1, Plot No. 52,<br />B/h. Parin Furniture, Gondal Road',
      addressLocality: 'Rajkot',
      addressRegion: 'Gujarat',
      postalCode: '360004',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-93278-41813',
      contactType: 'sales',
      areaServed: 'Worldwide',
      availableLanguage: ['English', 'Hindi', 'Gujarati'],
    },
    knowsAbout: [
      'Industrial Valves',
      'Ball Valves',
      'Gate Valves',
      'Globe Valves',
      'Check Valves',
      'Butterfly Valves',
      'Safety Valves',
      'Flow Control Engineering',
    ],
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'IndustrialSupply',
    name: 'Vertex Valve - Industrial Valve Manufacturer',
    image: `${siteUrl}/VertexValveLogo.png`,
    telephone: '+91-93278-41813',
    email: 'info@vertexvalve.com',
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rani industries Estate, Division-1, Plot No. 52,<br />B/h. Parin Furniture, Gondal Road',
      addressLocality: 'Rajkot',
      addressRegion: 'Gujarat',
      postalCode: '360004',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '22.2266486',
      longitude: '70.797714',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '20:00',
    },
    // priceRange: '$$',
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vertex Valve',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
