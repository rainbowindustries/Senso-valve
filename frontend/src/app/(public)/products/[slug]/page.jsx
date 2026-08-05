import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import ProductClient from './ProductClient'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vertexvalve.com'
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

async function getProduct(slug) {
  try {
    const res = await fetch(
      `${apiUrl}/products/${slug}`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    return data.data || null
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  const titleName = product?.name ? `${product.name} | Vertex Valve` : 'Industrial Valve Product | Vertex Valve'
  const descriptionText = product?.description || `${product?.name || 'Industrial valve'} manufactured by Vertex Valve (Rainbow Industries) in Rajkot, India. High precision engineering for critical fluid flow applications.`
  
  return {
    title: titleName,
    description: descriptionText,
    keywords: [
      product?.name,
      `${product?.name} manufacturer`,
      `${product?.name} supplier`,
      'industrial valve',
      'valve manufacturer India',
      'flow control valve',
    ].filter(Boolean),
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title: titleName,
      description: descriptionText,
      url: `${siteUrl}/products/${slug}`,
      siteName: 'Vertex Valve',
      images: product?.images?.[0] ? [{ url: product.images[0], alt: product.name }] : [],
      type: 'website',
    },
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-[24px] font-medium text-slate-900 mb-2">
            Product not found
          </h1>
          <Link
            href="/products"
            className="text-blue-500 text-[14px] flex items-center gap-1 justify-center"
          >
            <IconArrowLeft size={14} />
            Back to products
          </Link>
        </div>
      </main>
    )
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} manufactured by Vertex Valve`,
    image: product.images || [],
    brand: {
      '@type': 'Brand',
      name: 'Vertex Valve',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Vertex Valve (Rainbow Industries)',
    },
    category: product.categories?.name || 'Industrial Valves',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  }

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
        name: 'Products',
        item: `${siteUrl}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${siteUrl}/products/${slug}`,
      },
    ],
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductClient product={product} />
    </main>
  )
}
