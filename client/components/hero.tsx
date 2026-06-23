'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { ArrowRight } from 'lucide-react'
import GoogleSelectorModal from '@/components/GoogleSelectorModal'

const popularCategories = [
  { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=180&h=180&fit=crop' },
  { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=180&h=180&fit=crop' },
  { name: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=180&h=180&fit=crop' },
  { name: 'Chinese', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=180&h=180&fit=crop' },
  { name: 'South Indian', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=180&h=180&fit=crop' },
  { name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=180&h=180&fit=crop' }
]

export default function Hero() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isMounted, setIsMounted] = useState(false)
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false)

  const isAuthenticated = !!user && !loading

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAction = (targetPath: string) => {
    if (isAuthenticated) {
      router.push(targetPath)
    } else {
      router.push(`/auth/register?redirect=${encodeURIComponent(targetPath)}`)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  }

  return (
    <section className="w-full bg-white">
      {/* Banner Image Container */}
      <div className="relative w-full">
        <div className="relative h-[250px] w-full md:h-[450px]">
          <Image
            src="/tastepilot-banner.png"
            alt="Taste Pilot - Explore Taste Enjoy"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Hero Content Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Text block */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900">
              Explore. <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">Taste.</span> Enjoy.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
              Order delicious food from top-rated restaurants and discover meals with AI-powered recommendations.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAction('/restaurants')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-white font-bold shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition"
            >
              Explore Restaurants
              <ArrowRight size={20} />
            </motion.button>

            {!isAuthenticated && isMounted && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsGoogleModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl bg-white border border-gray-300 px-8 py-4 text-gray-700 font-bold hover:bg-gray-50 transition shadow cursor-pointer"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </motion.button>
            )}
          </div>

          {/* Divider */}
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full my-8" />

          {/* Popular Categories Grid */}
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              What's on your mind?
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 py-4">
              {popularCategories.map((category) => (
                <motion.div
                  key={category.name}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction(`/restaurants?category=${encodeURIComponent(category.name)}`)}
                  className="flex flex-col items-center gap-3 cursor-pointer group"
                >
                  {/* Circle Image Wrapper */}
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border border-gray-100 bg-orange-50 shadow-md group-hover:shadow-lg transition-shadow relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Category Name */}
                  <span className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-orange-500 transition-colors">
                    {category.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <GoogleSelectorModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        redirectPath="/restaurants"
      />
    </section>
  )
}