'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Clock, Truck, MapPin, ArrowUp } from 'lucide-react'
import FoodCard from '@/components/food-card'
import StickyCart from '@/components/sticky-cart'
import CategoryNav from '@/components/category-nav'
import MenuSearch from '@/components/menu-search'
import {
  menuCategories,
  menuItems,
  type MenuItem,
} from '@/lib/mock-menu-data'

interface CartItem extends MenuItem {
  quantity: number
}

const restaurantData = {
  id: '1',
  name: 'The Gourmet Kitchen',
  cuisine: 'Italian, Continental, Asian',
  rating: 4.6,
  reviews: 2543,
  deliveryTime: '35-45 mins',
  deliveryFee: 'Free delivery above ₹500',
  distance: '2.5 km away',
  banner: '/placeholder-restaurant.png',
  address: '123 Restaurant Street, City Center',
  info: 'Premium dining experience with authentic cuisines and fresh ingredients',
}

export default function RestaurantDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [vegOnly, setVegOnly] = useState(false)
  const [activeCategory, setActiveCategory] = useState('pizzas')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Filtered items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesCategory = item.category === activeCategory
      const matchesVeg = !vegOnly || item.veg

      return matchesSearch && matchesCategory && matchesVeg
    })
  }, [searchQuery, activeCategory, vegOnly])

  // Grouped items by category
  const itemsByCategory = useMemo(() => {
    return menuCategories.reduce(
      (acc, category) => {
        acc[category.id] = menuItems.filter((item) => item.category === category.id)
        return acc
      },
      {} as Record<string, MenuItem[]>
    )
  }, [])

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      }
      return [...prevCart, { ...item, quantity }]
    })
  }

  const handleRemoveItem = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(itemId)
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      )
    }
  }

  const handleCheckout = () => {
    alert(
      `Proceeding to checkout with ${cart.reduce((sum, item) => sum + item.quantity, 0)} items`
    )
  }

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-64 md:h-80 overflow-hidden"
      >
        <img
          src={restaurantData.banner}
          alt={restaurantData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Restaurant Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 -mt-12 relative z-10 mb-8"
      >
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {restaurantData.name}
              </h1>
              <p className="text-gray-600 mb-4">{restaurantData.cuisine}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{restaurantData.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {restaurantData.reviews} reviews
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {restaurantData.deliveryTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {restaurantData.deliveryFee}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {restaurantData.distance}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Menu Search */}
      <MenuSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        vegOnly={vegOnly}
        onVegOnlyChange={setVegOnly}
      />

      {/* Category Navigation */}
      <CategoryNav
        categories={menuCategories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Menu Items */}
      <div ref={contentRef} className="max-w-6xl mx-auto px-4 py-8 mb-32">
        {filteredItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item, index) => (
              <FoodCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-lg text-gray-600">
              No items found matching your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setVegOnly(false)
              }}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Sticky Cart */}
      <StickyCart
        items={cart}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          y: showScrollTop ? 0 : 20,
        }}
        onClick={scrollToTop}
        className="fixed bottom-40 right-4 md:bottom-8 md:right-8 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 z-40"
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
    </div>
  )
}
