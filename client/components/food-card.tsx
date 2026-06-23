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
  const [isZoomed, setIsZoomed] = useState(false)

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
      className="group rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
    >
      {/* Food Image */}
      <div 
        className="relative h-48 overflow-hidden bg-gray-100 cursor-pointer"
        onClick={() => setIsZoomed(true)}
      >
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
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 
            className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 cursor-pointer hover:text-orange-500 transition-colors"
            onClick={() => setIsZoomed(true)}
          >
            {item.name}
          </h3>
          {item.restaurantName && (
            <p className="text-xs font-semibold text-orange-600 mb-1">
              {item.restaurantName}
            </p>
          )}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>
        </div>

        <div>
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
      </div>

      {/* Zoomed Image Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black/85 flex flex-col items-center justify-center z-50 transition-opacity duration-300"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-[85vh] mx-4 flex flex-col items-center">
            <button 
              className="absolute -top-12 right-0 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center text-2xl font-bold focus:outline-none transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
            >
              &times;
            </button>
            <img 
              src={item.image} 
              alt={item.name} 
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()} 
            />
            <div className="mt-4 text-white text-center">
              <h2 className="text-2xl font-bold">{item.name}</h2>
              {item.description && <p className="text-gray-300 text-sm mt-1 max-w-lg mx-auto">{item.description}</p>}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
