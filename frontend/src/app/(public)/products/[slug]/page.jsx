import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import ProductClient from './ProductClient'

async function getProduct(slug) {
  try {
    const res = await fetch(
      `http://localhost:8000/api/v1/products/${slug}`,
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
  return {
    title: `${product?.name || 'Product'} | Hammer Valve Industries`,
    description: product?.description || 'Industrial valve product details',
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

  return (
    <main>
      <ProductClient product={product} />
    </main>
  )
}