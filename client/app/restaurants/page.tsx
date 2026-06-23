'use client'

import { useState, useMemo, useEffect } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantCard from '@/components/restaurant-card'
import RestaurantFilters from '@/components/restaurant-filters'
import { RestaurantGridSkeleton } from '@/components/restaurant-skeleton'
import { mockRestaurants, AVAILABLE_CUISINES } from '@/lib/mock-restaurants'
import { apiCall, isAuthenticated } from '@/lib/auth'
import { useAuth } from '@/context/AuthContext'

interface FilterState {
  search: string
  selectedCuisines: string[]
  vegOnly: boolean
  minRating: number
  sortBy: 'rating' | 'delivery-time' | 'name'
}

export default function RestaurantsPage() {
  const { user } = useAuth()
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    selectedCuisines: [],
    vegOnly: false,
    minRating: 0,
    sortBy: 'rating',
  })

  const defaultAddress = useMemo(() => {
    return user?.addresses?.find((a: any) => a.isDefault)
  }, [user])

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        
        let queryParams = 'limit=120'
        if (defaultAddress) {
          if (defaultAddress.latitude && defaultAddress.longitude) {
            queryParams += `&lat=${defaultAddress.latitude}&lng=${defaultAddress.longitude}`
          }
          if (defaultAddress.city) {
            queryParams += `&city=${encodeURIComponent(defaultAddress.city)}`
          }
        }

        const res = await fetch(`${apiUrl}/api/restaurants?${queryParams}`)
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
            distance: r.distance !== undefined ? `${r.distance} km away` : undefined,
          }))
          setRestaurants(mapped)
        } else {
          setRestaurants(mockRestaurants)
        }

        if (isAuthenticated()) {
          const wRes = await apiCall('/wishlist')
          if (wRes.ok) {
            const wJson = await wRes.json()
            if (wJson.success && wJson.data) {
              setWishlistIds(wJson.data.map((r: any) => r._id))
            }
          }
        }
      } catch (err) {
        console.error('Error fetching restaurants/wishlist, falling back to mock data:', err)
        setRestaurants(mockRestaurants)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurants()

    // Read URL query parameters to pre-fill search, cuisines, or vegOnly
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const searchParam = params.get('search') || ''
      const cuisineParam = params.get('cuisine') || params.get('category') || ''
      const vegParam = params.get('veg') === 'true'

      if (searchParam || cuisineParam || vegParam) {
        setFilters(prev => ({
          ...prev,
          search: searchParam || cuisineParam || prev.search,
          selectedCuisines: cuisineParam ? [cuisineParam] : prev.selectedCuisines,
          vegOnly: vegParam || prev.vegOnly,
        }))
      }
    }
  }, [defaultAddress])

  const currentRestaurantsList = restaurants.length > 0 ? restaurants : mockRestaurants

  const cuisinesList = useMemo(() => {
    const set = new Set(currentRestaurantsList.flatMap((r) => r.cuisine))
    return Array.from(set).sort()
  }, [currentRestaurantsList])

  const filteredAndSortedRestaurants = useMemo(() => {
    let result = [...currentRestaurantsList]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        r =>
          r.name.toLowerCase().includes(searchLower) ||
          r.cuisine.some((c: string) => c.toLowerCase().includes(searchLower))
      )
    }

    // Cuisine filter
    if (filters.selectedCuisines.length > 0) {
      result = result.filter(r =>
        filters.selectedCuisines.some((c: string) => r.cuisine.includes(c))
      )
    }

    // Veg only filter
    if (filters.vegOnly) {
      result = result.filter(r => r.vegOnly)
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter(r => r.rating >= filters.minRating)
    }

    // Sorting
    switch (filters.sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'delivery-time':
        result.sort((a, b) => a.deliveryTime - b.deliveryTime)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [filters, currentRestaurantsList])

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
          <p className="mt-2 text-gray-600">
            Discover great food from amazing restaurants
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <RestaurantFilters
                cuisines={cuisinesList}
                onFiltersChange={setFilters}
              />
            </div>
          </div>

          {/* Restaurants Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <RestaurantGridSkeleton count={12} />
            ) : filteredAndSortedRestaurants.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {filteredAndSortedRestaurants.length} restaurant
                  {filteredAndSortedRestaurants.length !== 1 ? 's' : ''}
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedRestaurants.map((restaurant) => (
                    <RestaurantCard 
                      key={restaurant.id} 
                      {...restaurant} 
                      isInitiallyWishlisted={wishlistIds.includes(restaurant.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    No Restaurants Found
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms to find more options.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        search: '',
                        selectedCuisines: [],
                        vegOnly: false,
                        minRating: 0,
                        sortBy: 'rating',
                      })
                    }
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}