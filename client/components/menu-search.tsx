'use client'

import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'

interface MenuSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  vegOnly: boolean
  onVegOnlyChange: (vegOnly: boolean) => void
}

export default function MenuSearch({
  searchQuery,
  onSearchChange,
  vegOnly,
  onVegOnlyChange,
}: MenuSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 border-b border-gray-200 sticky top-32 z-40 md:relative"
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 outline-none text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => onVegOnlyChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Veg Only
              </span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
