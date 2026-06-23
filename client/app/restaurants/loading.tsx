import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { RestaurantGridSkeleton } from '@/components/restaurant-skeleton'

export default function Loading() {
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
          {/* Filters Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-pulse space-y-6">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          </div>

          {/* Restaurants Grid Skeleton */}
          <div className="lg:col-span-3">
            <div className="mb-4 h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <RestaurantGridSkeleton count={12} />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
