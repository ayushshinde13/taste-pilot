'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface FilterState {
  search: string
  selectedCuisines: string[]
  vegOnly: boolean
  minRating: number
  sortBy: 'rating' | 'delivery-time' | 'name'
}

interface RestaurantFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  cuisines: string[]
}

const RATING_OPTIONS = [3, 3.5, 4, 4.5]
const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'delivery-time', label: 'Fastest Delivery' },
  { value: 'name', label: 'Name (A-Z)' },
]

export default function RestaurantFilters({
  onFiltersChange,
  cuisines,
}: RestaurantFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    selectedCuisines: [],
    vegOnly: false,
    minRating: 0,
    sortBy: 'rating',
  })

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleCuisineToggle = (cuisine: string) => {
    const newCuisines = filters.selectedCuisines.includes(cuisine)
      ? filters.selectedCuisines.filter(c => c !== cuisine)
      : [...filters.selectedCuisines, cuisine]
    const newFilters = { ...filters, selectedCuisines: newCuisines }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleVegToggle = () => {
    const newFilters = { ...filters, vegOnly: !filters.vegOnly }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, minRating: filters.minRating === rating ? 0 : rating }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSortChange = (value: string) => {
    const newFilters = { ...filters, sortBy: value as FilterState['sortBy'] }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters: FilterState = {
      search: '',
      selectedCuisines: [],
      vegOnly: false,
      minRating: 0,
      sortBy: 'rating',
    }
    setFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Search Bar */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Search Restaurants
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or cuisine..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Cuisine Filters */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Cuisines
        </label>
        <div className="flex flex-wrap gap-2">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => handleCuisineToggle(cuisine)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filters.selectedCuisines.includes(cuisine)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Veg Only Toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.vegOnly}
            onChange={handleVegToggle}
            className="w-4 h-4 text-orange-500 rounded cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700">Show Veg Only</span>
        </label>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Minimum Rating
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleRatingChange(0)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filters.minRating === 0
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {RATING_OPTIONS.map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filters.minRating === rating
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {rating}+ ⭐
            </button>
          ))}
        </div>
      </div>

      {/* Sort Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
      >
        <X size={18} />
        Clear All Filters
      </button>
    </div>
  )
}
