import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import Categories from '@/components/categories'
import Restaurants from '@/components/restaurants'
import Features from '@/components/features'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white">
      <Navbar />
      <Hero />
      <Categories />
      <Restaurants />
      <Features />
      <Footer />
    </main>
  )
}
