import Image from 'next/image'
import { Star, Clock, Wallet } from 'lucide-react'

interface RestaurantCardProps {
  id: string
  name: string
  image: string
  cuisine: string[]
  rating: number
  deliveryTime: number
  priceRange: string
}

export default function RestaurantCard({
  name,
  image,
  cuisine,
  rating,
  deliveryTime,
  priceRange,
}: RestaurantCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 truncate">{name}</h3>

        {/* Cuisine */}
        <p className="text-sm text-gray-600 truncate mb-3">
          {cuisine.join(', ')}
        </p>

        {/* Rating, Time, Price */}
        <div className="flex items-center justify-between text-sm text-gray-700">
          {/* Rating */}
          <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
            <Star size={14} className="fill-green-600 text-green-600" />
            <span className="font-semibold text-green-600">{rating.toFixed(1)}</span>
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
  )
}
