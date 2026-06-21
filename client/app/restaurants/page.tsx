'use client'

import { useState, useMemo } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantCard from '@/components/restaurant-card'
import RestaurantFilters from '@/components/restaurant-filters'
import { RestaurantGridSkeleton } from '@/components/restaurant-skeleton'
import { mockRestaurants, AVAILABLE_CUISINES, Restaurant } from '@/lib/mock-restaurants'

interface FilterState {
  search: string
  selectedCuisines: string[]
  vegOnly: boolean
  minRating: number
  sortBy: 'rating' | 'delivery-time' | 'name'
}

export default function RestaurantsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    selectedCuisines: [],
    vegOnly: false,
    minRating: 0,
    sortBy: 'rating',
  })

  const filteredAndSortedRestaurants = useMemo(() => {
    let result = [...mockRestaurants]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        r =>
          r.name.toLowerCase().includes(searchLower) ||
          r.cuisine.some(c => c.toLowerCase().includes(searchLower))
      )
    }

    // Cuisine filter
    if (filters.selectedCuisines.length > 0) {
      result = result.filter(r =>
        filters.selectedCuisines.some(c => r.cuisine.includes(c))
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
  }, [filters])

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
                cuisines={AVAILABLE_CUISINES}
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
                    <RestaurantCard key={restaurant.id} {...restaurant} />
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