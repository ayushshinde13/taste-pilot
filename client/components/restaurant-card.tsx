import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Star, Clock, Wallet, Heart } from 'lucide-react'
import { apiCall, isAuthenticated } from '@/lib/auth'

interface RestaurantCardProps {
  id: string
  name: string
  image: string
  cuisine: string[]
  rating: number
  deliveryTime: number
  priceRange: string
  isInitiallyWishlisted?: boolean
}

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

function getFallbackImage(name: string, cuisineArray: string[]) {
  const nameLower = name.toLowerCase()
  const cuisines = (cuisineArray || []).map(c => c.toLowerCase())

  // Check South Indian / Idli / Dosa
  if (cuisines.some(c => c.includes('south indian') || c.includes('dosa') || c.includes('idli')) || nameLower.includes('dosa') || nameLower.includes('idli') || nameLower.includes('uttapam') || nameLower.includes('sambar')) {
    return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&h=300&fit=crop' // South Indian (Idli)
  }

  // Check pizza
  if (cuisines.some(c => c.includes('pizza')) || nameLower.includes('pizza')) {
    return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' // Pizza
  }
  // Check burger
  if (cuisines.some(c => c.includes('burger')) || nameLower.includes('burger')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' // Burger
  }
  // Check biryani / indian / kebab / mughlai
  if (cuisines.some(c => c.includes('biryani') || c.includes('kebab') || c.includes('mughlai') || c.includes('mandi') || c.includes('north indian') || c.includes('andhra')) || nameLower.includes('biryani') || nameLower.includes('bawarchi') || nameLower.includes('ghouse') || nameLower.includes('mehfil') || nameLower.includes('kebab')) {
    return 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop' // Biryani / Indian
  }
  // Check dessert / sweet / bakery / cake / ice cream
  if (cuisines.some(c => c.includes('dessert') || c.includes('bakery') || c.includes('sweet') || c.includes('mithai') || c.includes('ice cream') || c.includes('cake') || c.includes('waffle')) || nameLower.includes('bakery') || nameLower.includes('sweet') || nameLower.includes('cake') || nameLower.includes('cream')) {
    return 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop' // Dessert
  }
  // Check chinese / asian / noodles / momos / sichuan
  if (cuisines.some(c => c.includes('chinese') || c.includes('asian') || c.includes('momo') || c.includes('noodle') || c.includes('wok') || c.includes('sichuan')) || nameLower.includes('chinese') || nameLower.includes('wok') || nameLower.includes('momo')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop' // Chinese
  }
  // Check salad / healthy
  if (cuisines.some(c => c.includes('salad') || c.includes('healthy')) || nameLower.includes('salad') || nameLower.includes('healthy') || nameLower.includes('bowl')) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop' // Salad
  }
  // Check pasta / Italian
  if (cuisines.some(c => c.includes('pasta') || c.includes('italian')) || nameLower.includes('pasta')) {
    return 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop' // Pasta
  }
  // Check sandwich
  if (cuisines.some(c => c.includes('sandwich') || c.includes('wrap') || c.includes('roll')) || nameLower.includes('sandwich') || nameLower.includes('subway')) {
    return 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop' // Sandwich
  }

  // General fallback by hashing name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % fallbackImages.length
  return fallbackImages[index]
}

export default function RestaurantCard({
  id,
  name,
  image,
  cuisine,
  rating,
  deliveryTime,
  priceRange,
  isInitiallyWishlisted = false,
}: RestaurantCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(isInitiallyWishlisted)
  const [hasAuth, setHasAuth] = useState(false)

  useEffect(() => {
    setHasAuth(isAuthenticated())
    setIsWishlisted(isInitiallyWishlisted)
  }, [isInitiallyWishlisted])

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await apiCall('/wishlist/toggle', {
        method: 'POST',
        body: JSON.stringify({ restaurantId: id }),
      })
      if (res.ok) {
        setIsWishlisted(!isWishlisted)
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err)
    }
  }

  const displayImage = image && !image.startsWith('/images/restaurants/')
    ? (image.startsWith('/images/')
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${image}`
        : image)
    : getFallbackImage(name, cuisine)

  return (
    <Link href={`/restaurant/${id}`} className="block">
      <div className="group overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col relative">
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Wishlist Button */}
          {hasAuth && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 shadow transition z-10"
            >
              <Heart
                size={18}
                className={isWishlisted ? 'fill-red-500 text-red-500' : ''}
              />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Name */}
            <h3 className="text-lg font-bold text-gray-900 truncate">{name}</h3>

            {/* Cuisine */}
            <p className="text-sm text-gray-600 truncate mb-3">
              {cuisine.join(', ')}
            </p>
          </div>

          {/* Rating, Time, Price */}
          <div className="flex items-center justify-between text-sm text-gray-700 mt-auto pt-2 border-t border-gray-100">
            {/* Rating */}
            <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
              <Star size={14} className="fill-green-600 text-green-600" />
              <span className="font-semibold text-green-600">{(rating || 0).toFixed(1)}</span>
            </div>

            {/* Delivery Time */}
            <div className="flex items-center gap-1 text-gray-600">
              <Clock size={14} />
              <span>{deliveryTime} min</span>
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-1 text-gray-600">
              <Wallet size={14} />
              <span>{priceRange}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

