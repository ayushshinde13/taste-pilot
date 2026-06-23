'use client'

import { useState, useMemo, useRef, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star, Clock, Truck, MapPin, ArrowUp, AlertCircle } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import FoodCard from '@/components/food-card'
import StickyCart from '@/components/sticky-cart'
import CategoryNav from '@/components/category-nav'
import MenuSearch from '@/components/menu-search'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { apiCall } from '@/lib/auth'

const fallbackImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop',
]

const fallbackBanners = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=400&fit=crop',
]

function getFallbackImage(name: string) {
  const nameLower = name.toLowerCase()

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hashVal = Math.abs(hash)

  const getBaseUrl = () => {
    // Check Momos
    if (nameLower.includes('momo') || nameLower.includes('momos')) {
      return 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop'
    }

    // Check Street Food / Samosa / Chaat / Pani Puri / Pav Bhaji
    if (lowerIncludesAny(nameLower, ['pani puri', 'vada pav', 'samosa', 'chaat', 'pav bhaji', 'bhel', 'dahi puri', 'street food'])) {
      return 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&h=300&fit=crop'
    }

    // Check Healthy Bowls / Protein Meals / Keto / Vegan
    if (lowerIncludesAny(nameLower, ['buddha bowl', 'protein bowl', 'quinoa', 'keto', 'vegan', 'sprouts salad', 'health bowl'])) {
      return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'
    }

    // Check Smoothies / Milkshakes / Protein Shakes
    if (lowerIncludesAny(nameLower, ['smoothie', 'milkshake', 'shake', 'shakes', 'smoothies'])) {
      return 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop'
    }

    // Check Idli specifically
    if (nameLower.includes('idli') || nameLower.includes('idlis')) {
      return 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop'
    }

    // Check Dosa / South Indian fallbacks
    if (nameLower.includes('dosa') || nameLower.includes('uttapam') || nameLower.includes('sambar') || nameLower.includes('south indian')) {
      return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&h=300&fit=crop'
    }

    // Check pizza
    if (nameLower.includes('pizza')) {
      return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
    }
    // Check burger
    if (nameLower.includes('burger') || nameLower.includes('slider')) {
      return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
    }
    // Check biryani / kebab / rice
    if (nameLower.includes('biryani') || nameLower.includes('rice') || nameLower.includes('pulao') || nameLower.includes('kebab') || nameLower.includes('tandoori') || nameLower.includes('chicken')) {
      return 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop'
    }
    // Check dessert / sweet / cake / ice cream / waffle
    if (nameLower.includes('cake') || nameLower.includes('dessert') || nameLower.includes('sweet') || nameLower.includes('waffle') || nameLower.includes('cream') || nameLower.includes('chocolate') || nameLower.includes('pastry') || nameLower.includes('donut')) {
      return 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop'
    }
    // Check noodle / pasta / spaghetti
    if (nameLower.includes('noodle') || nameLower.includes('pasta') || nameLower.includes('spaghetti') || nameLower.includes('chow mein') || nameLower.includes('macaroni') || nameLower.includes('chinese')) {
      return 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop'
    }
    // Check salad / healthy
    if (nameLower.includes('salad') || nameLower.includes('healthy') || nameLower.includes('fruit') || nameLower.includes('bowl')) {
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
    }
    // Check roll / sandwich / wrap
    if (nameLower.includes('roll') || nameLower.includes('sandwich') || nameLower.includes('wrap') || nameLower.includes('sub')) {
      return 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop'
    }
    // Check beverages / drinks
    if (nameLower.includes('coffee') || nameLower.includes('soda') || nameLower.includes('lassi') || nameLower.includes('chai') || nameLower.includes('tea') || nameLower.includes('beverage') || nameLower.includes('lime') || nameLower.includes('drink') || nameLower.includes('juice')) {
      return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop'
    }
    // Check North Indian / Curry / Paneer / Butter Chicken / Dal
    if (nameLower.includes('paneer') || nameLower.includes('butter chicken') || nameLower.includes('dal') || nameLower.includes('roti') || nameLower.includes('chole') || nameLower.includes('north indian') || nameLower.includes('curry') || nameLower.includes('makhani')) {
      return 'https://images.unsplash.com/photo-1585521537519-e21cc028cb29?w=400&h=300&fit=crop'
    }

    function lowerIncludesAny(str: string, searchTerms: string[]) {
      return searchTerms.some((term) => str.includes(term))
    }

    const index = hashVal % fallbackImages.length
    return fallbackImages[index]
  }

  const baseUrl = getBaseUrl()
  return `${baseUrl}&sig=${hashVal}`
}

function getFallbackBanner(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % fallbackBanners.length
  return fallbackBanners[index]
}

export default function RestaurantDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id: restaurantId } = use(params)
  
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [vegOnly, setVegOnly] = useState(false)
  const [activeCategory, setActiveCategory] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const [restaurantData, setRestaurantData] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [menuCategories, setMenuCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const res = await apiCall(`/restaurants/${restaurantId}`)
        const json = await res.json()

        if (json.success && json.data) {
          const rest = json.data.restaurant
          const rawMenu = json.data.menu || []
          
          setRestaurantData({
            id: rest._id,
            name: rest.name,
            cuisine: Array.isArray(rest.cuisine) ? rest.cuisine.join(', ') : rest.cuisine || 'Multi-cuisine',
            rating: rest.rating || 4.0,
            reviews: rest.reviewCount || rest.totalRatings || 0,
            deliveryTime: rest.deliveryTime ? `${rest.deliveryTime} mins` : '30-40 mins',
            deliveryFee: rest.priceForOne > 500 ? 'Free delivery above ₹500' : `₹30 delivery fee`,
            distance: '2.5 km away',
            banner: rest.bannerImage
              ? (rest.bannerImage.startsWith('/images/')
                  ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${rest.bannerImage}`
                  : rest.bannerImage)
              : getFallbackBanner(rest.name),
            address: rest.address ? `${rest.address.street}, ${rest.address.city}` : 'Hyderabad',
            info: rest.description || 'Premium dining experience with authentic cuisines and fresh ingredients',
          })

          const mappedMenu = rawMenu.map((item: any) => ({
            id: item._id,
            name: item.name,
            description: item.description || '',
            price: item.price || 150,
            image: item.image
              ? (item.image.startsWith('/images/')
                  ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${item.image}`
                  : item.image)
              : getFallbackImage(item.name),
            category: item.category,
            veg: item.isVeg !== undefined ? item.isVeg : true,
            rating: item.rating || 4.3,
            restaurantName: item.restaurantName || rest.name,
          }))
          setMenuItems(mappedMenu)

          // Build dynamic categories
          const catsMap = new Map<string, number>()
          mappedMenu.forEach((item: any) => {
            catsMap.set(item.category, (catsMap.get(item.category) || 0) + 1)
          })

          const categoriesList = [
            { id: 'all', name: 'All Items', count: mappedMenu.length },
            ...Array.from(catsMap.entries()).map(([name, count]) => ({
              id: name,
              name,
              count,
            }))
          ]
          
          setMenuCategories(categoriesList)
          if (categoriesList.length > 0) {
            setActiveCategory('all')
          }

        } else {
          setError(json.message || 'Failed to load restaurant details')
        }
      } catch (err: any) {
        console.error('Error fetching restaurant details:', err)
        setError(err.message || 'Connection error while fetching restaurant details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetails()
  }, [restaurantId])

  // Filtered items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = 
        item.name.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower))

      const matchesCategory = activeCategory === 'all' || searchQuery !== '' || item.category === activeCategory
      const matchesVeg = !vegOnly || item.veg

      return matchesSearch && matchesCategory && matchesVeg
    })
  }, [searchQuery, activeCategory, vegOnly, menuItems])

  const handleAddToCart = (item: any, quantity: number) => {
    if (!restaurantData) return
    const existing = cartItems.find((i) => i.id === item.id)
    if (existing) {
      updateQuantity(item.id, existing.quantity + quantity)
    } else {
      for (let i = 0; i < quantity; i++) {
        addToCart(
          {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            isVeg: item.veg,
          },
          restaurantData.id,
          restaurantData.name
        )
      }
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId)
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity)
  }

  const handleCheckout = () => {
    router.push('/cart')
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <div>
          <Navbar />
          {/* Skeleton Hero */}
          <div className="h-64 md:h-80 bg-gray-200 animate-pulse" />
          
          <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-10 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="flex gap-4">
                <div className="h-6 bg-gray-200 rounded w-20" />
                <div className="h-6 bg-gray-200 rounded w-20" />
                <div className="h-6 bg-gray-200 rounded w-20" />
              </div>
            </div>
          </div>

          {/* Skeleton Categories */}
          <div className="max-w-6xl mx-auto px-4 py-4 flex gap-4 overflow-x-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse flex-shrink-0" />
            ))}
          </div>

          {/* Skeleton Menu Grid */}
          <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg bg-white overflow-hidden p-4 space-y-4 animate-pulse">
                <div className="h-40 bg-gray-200 w-full rounded animate-pulse" />
                <div className="h-6 bg-gray-200 w-3/4 rounded" />
                <div className="h-4 bg-gray-200 w-1/2 rounded" />
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 w-12 rounded" />
                  <div className="h-8 bg-gray-200 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !restaurantData) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <div>
          <Navbar />
          <div className="max-w-xl mx-auto px-4 py-22 text-center space-y-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Failed to load restaurant</h2>
            <p className="text-gray-600">{error || 'Restaurant not found'}</p>
            <button
              onClick={() => router.push('/restaurants')}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Back to Restaurants
            </button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Navbar />
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
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {restaurantData.name}
                </h1>
                <p className="text-gray-600 mb-4">{restaurantData.cuisine}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4 border-gray-100">
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
                    <span className="text-sm text-gray-600 truncate max-w-[150px]">
                      {restaurantData.address}
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
        {menuCategories.length > 0 && (
          <CategoryNav
            categories={menuCategories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        )}

        {/* Menu Items */}
        <div ref={contentRef} className="max-w-6xl mx-auto px-4 py-8 mb-32">
          {filteredItems.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item) => (
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
              className="text-center py-12 bg-white rounded-lg border border-gray-150 p-6"
            >
              <p className="text-lg text-gray-600">
                No items found matching your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setVegOnly(false)
                }}
                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>

        {/* Sticky Cart */}
        <StickyCart
          items={cartItems}
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
      <Footer />
    </main>
  )
}

