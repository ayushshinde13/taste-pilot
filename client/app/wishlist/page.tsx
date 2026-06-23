'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantCard from '@/components/restaurant-card'
import { RestaurantGridSkeleton } from '@/components/restaurant-skeleton'
import { apiCall } from '@/lib/auth'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setIsLoading(true)
        const res = await apiCall('/wishlist')
        const json = await res.json()
        if (json.success && json.data) {
          const mapped = json.data.map((r: any) => ({
            id: r._id,
            name: r.name,
            image: r.image || '',
            cuisine: r.cuisine || [],
            rating: r.rating || 0,
            deliveryTime: r.deliveryTime || 30,
            priceRange: r.priceForOne ? `₹${r.priceForOne} for one` : '₹150 for one',
            vegOnly: r.isVeg || false,
          }))
          setWishlist(mapped)
        } else {
          setError('Failed to load wishlist')
        }
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Connection error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWishlist()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="mt-2 text-gray-600">
              Your favorite restaurants, saved in one place
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <RestaurantGridSkeleton count={6} />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
              >
                Retry
              </button>
            </div>
          ) : wishlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((restaurant) => (
                <RestaurantCard key={restaurant.id} {...restaurant} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">❤️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Explore restaurants and save your favorites here.
              </p>
              <a
                href="/restaurants"
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
              >
                Browse Restaurants
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
