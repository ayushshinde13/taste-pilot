'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { ArrowRight } from 'lucide-react'

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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8"
        >
          {/* Text block */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900"
            >
              Explore. <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">Taste.</span> Enjoy.
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed font-medium"
            >
              Order delicious food from top-rated restaurants and discover meals with AI-powered recommendations.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAction('/restaurants')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-white font-bold shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition"
            >
              Explore Restaurants
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>

          {/* Divider */}
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full my-8" />

          {/* Popular Categories Grid */}
          <motion.div variants={itemVariants} className="space-y-6">
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}