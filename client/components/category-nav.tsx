'use client'

import { motion } from 'framer-motion'
import type { MenuCategory } from '@/lib/mock-menu-data'

interface CategoryNavProps {
  categories: MenuCategory[]
  activeCategory: string
  onSelectCategory: (categoryId: string) => void
}

export default function CategoryNav({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryNavProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-16 bg-white border-b border-gray-200 z-40 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
        <div className="flex gap-2 py-4">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                activeCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
              <span className="text-xs ml-1 opacity-75">({category.count})</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
