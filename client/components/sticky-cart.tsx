'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X } from 'lucide-react'
import type { MenuItem } from '@/lib/mock-menu-data'

interface CartItem extends MenuItem {
  quantity: number
}

interface StickyCartProps {
  items: CartItem[]
  onRemoveItem: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onCheckout: () => void
}

export default function StickyCart({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
}: StickyCartProps) {
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  if (items.length === 0) return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Cart Summary for Mobile */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {totalItems}
            </div>
            <span className="font-medium text-gray-900">
              ₹{totalPrice.toLocaleString()}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCheckout}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600"
          >
            Checkout
          </motion.button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-4 max-h-32 overflow-y-auto">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 bg-gray-100 rounded-lg p-2 min-w-max"
              >
                <div className="text-sm">
                  <p className="font-medium text-gray-900 truncate max-w-[120px]">
                    {item.name}
                  </p>
                  <p className="text-gray-600">
                    ₹{item.price} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onUpdateQuantity(
                        item.id,
                        Math.max(0, item.quantity - 1)
                      )
                    }
                    className="text-orange-500 hover:bg-orange-100 w-6 h-6 flex items-center justify-center rounded"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.id, item.quantity + 1)
                    }
                    className="text-orange-500 hover:bg-orange-100 w-6 h-6 flex items-center justify-center rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-gray-500 hover:text-red-500 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-4 border-l border-gray-200 pl-4">
            <div className="text-right">
              <p className="text-gray-600 text-sm">Total ({totalItems} items)</p>
              <p className="text-2xl font-bold text-orange-500">
                ₹{totalPrice.toLocaleString()}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCheckout}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 whitespace-nowrap flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Checkout
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
