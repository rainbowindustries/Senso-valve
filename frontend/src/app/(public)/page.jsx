import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import IndustriesServed from '@/components/home/IndustriesServed'
import Certifications from '@/components/home/Certifications'

// Fetch featured products from backend
async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?featured=true`,
      {
        cache: 'no-store'
      }
    )
    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

export default async function Home() {
  const products = await getFeaturedProducts()

  return (
    <main>
      <HeroSection />
      <FeaturedProducts products={products} />
      <IndustriesServed />
      {/* <Certifications /> */}
    </main>
  )
}