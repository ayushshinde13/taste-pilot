'use client'

import { Star, Clock, Bike } from 'lucide-react'

const restaurants = [
  {
    id: 1,
    name: 'Spice Paradise',
    cuisine: 'Indian, North Indian',
    rating: 4.8,
    reviews: 2340,
    deliveryTime: '25-30 mins',
    deliveryFee: 'Free',
    image: '🏢',
  },
  {
    id: 2,
    name: 'The Pizza Corner',
    cuisine: 'Pizza, Italian',
    rating: 4.6,
    reviews: 1890,
    deliveryTime: '20-25 mins',
    deliveryFee: '₹20',
    image: '🍕',
  },
  {
    id: 3,
    name: 'Burger Bliss',
    cuisine: 'Burgers, American',
    rating: 4.7,
    reviews: 2100,
    deliveryTime: '15-20 mins',
    deliveryFee: 'Free',
    image: '🍔',
  },
  {
    id: 4,
    name: 'Biryani Kingdom',
    cuisine: 'Biryani, Hyderabadi',
    rating: 4.9,
    reviews: 3200,
    deliveryTime: '30-35 mins',
    deliveryFee: '₹30',
    image: '🍛',
  },
  {
    id: 5,
    name: 'The Wok Master',
    cuisine: 'Chinese, Asian',
    rating: 4.5,
    reviews: 1650,
    deliveryTime: '25-30 mins',
    deliveryFee: '₹20',
    image: '🥡',
  },
  {
    id: 6,
    name: 'Sweet Treats',
    cuisine: 'Desserts, Bakery',
    rating: 4.8,
    reviews: 2800,
    deliveryTime: '10-15 mins',
    deliveryFee: 'Free',
    image: '🍰',
  },
]

export default function Restaurants() {
  return (
    <section id="restaurants" className="w-full bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">Featured Restaurants</h2>
        <p className="mb-8 text-gray-600">Discover top-rated restaurants in your area</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl hover:scale-105 cursor-pointer"
            >
              {/* Restaurant Image */}
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                <span className="text-6xl">{restaurant.image}</span>
              </div>

              {/* Restaurant Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{restaurant.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{restaurant.cuisine}</p>

                {/* Rating and Reviews */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{restaurant.rating}</span>
                    <span className="text-sm text-gray-600">({restaurant.reviews})</span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="flex gap-4 border-t pt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-orange-500" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Bike size={16} className="text-orange-500" />
                    <span>{restaurant.deliveryFee}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
