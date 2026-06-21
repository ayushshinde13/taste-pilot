'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Plus, Minus } from 'lucide-react'
import type { MenuItem } from '@/lib/mock-menu-data'

interface FoodCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem, quantity: number) => void
}

export default function FoodCard({ item, onAddToCart }: FoodCardProps) {
  const [quantity, setQuantity] = useState(0)

  const handleAddToCart = () => {
    if (quantity > 0) {
      onAddToCart(item, quantity)
      setQuantity(0)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Food Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
        />
        {item.veg && (
          <div className="absolute top-3 right-3 w-6 h-6 border-2 border-green-500 rounded flex items-center justify-center bg-white">
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        )}
        {!item.veg && (
          <div className="absolute top-3 right-3 w-6 h-6 border-2 border-red-500 rounded flex items-center justify-center bg-white">
            <div className="w-2 h-2 rounded-full bg-red-500" />
          </div>
        )}
      </div>

      {/* Food Details */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Rating and Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">
              {item.rating}
            </span>
          </div>
          <span className="text-lg font-bold text-orange-500">
            ₹{item.price}
          </span>
        </div>

        {/* Add to Cart Button */}
        {quantity === 0 ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setQuantity(1)}
            className="w-full py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
          >
            Add to Cart
          </motion.button>
        ) : (
          <div className="flex items-center justify-between bg-orange-100 rounded-lg p-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (quantity > 0) setQuantity(quantity - 1)
              }}
              className="w-8 h-8 flex items-center justify-center hover:bg-orange-200 rounded"
            >
              <Minus className="w-4 h-4 text-orange-500" />
            </motion.button>
            <span className="font-bold text-orange-500">{quantity}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-orange-200 rounded"
            >
              <Plus className="w-4 h-4 text-orange-500" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="flex-1 py-1 mx-1 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 transition"
            >
              Add
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
