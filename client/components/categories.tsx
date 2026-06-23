'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const categories = [
  { icon: '🍕', name: 'Pizza' },
  { icon: '🍔', name: 'Burger' },
  { icon: '🍛', name: 'Biryani' },
  { icon: '🥡', name: 'Chinese' },
  { icon: '🥘', name: 'South Indian' },
  { icon: '🍢', name: 'North Indian' },
  { icon: '🍰', name: 'Desserts' },
  { icon: '🥤', name: 'Beverages' },
]

export default function Categories() {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="w-full bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">What are you hungry for?</h2>

        <div className="relative">
          {/* Scroll Container */}
          <div
            ref={scrollRef}
            className="scrollbar-hide flex gap-4 overflow-x-auto"
          >
            {categories.map((category) => (
              <div
                key={category.name}
                onClick={() => router.push(`/restaurants?cuisine=${encodeURIComponent(category.name)}`)}
                className="flex-shrink-0 transform cursor-pointer rounded-lg border border-gray-200 bg-white p-6 text-center transition hover:shadow-lg hover:scale-105"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <p className="font-semibold text-gray-800 whitespace-nowrap">{category.name}</p>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-orange-500 p-2 text-white shadow-lg hover:bg-orange-600 transition hidden md:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-orange-500 p-2 text-white shadow-lg hover:bg-orange-600 transition hidden md:flex"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
