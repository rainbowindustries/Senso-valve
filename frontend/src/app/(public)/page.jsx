import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import IndustriesServed from '@/components/home/IndustriesServed'
import Certifications from '@/components/home/Certifications'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: '',
  description: 'Vertex Valve is a top industrial valve manufacturer in Rajkot, India. High-quality precision Ball Valves, Gate Valves, Globe Valves, Check Valves, Butterfly Valves, and custom flow control solutions exported to 40+ countries.',
  keywords: [
    'industrial valve manufacturer',
    'ball valve manufacturer',
    'gate valve manufacturer',
    'butterfly valve exporter',
    'check valve supplier',
    'globe valve exporter',
    'valve manufacturer Rajkot',
    'high pressure valves',
    'flow control valves',
  ],
  alternates: {
    canonical: '/',
  },
}

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