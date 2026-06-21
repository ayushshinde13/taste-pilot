'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { MapPin, Search } from 'lucide-react'

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white to-orange-50">
      {/* Banner Image Container */}
      <div className="relative w-full">
        <div className="relative h-[300px] w-full md:h-[500px]">
          <Image
            src="/tastepilot-banner.png"
            alt="Taste Pilot - Explore Taste Enjoy"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Search Section */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Food Search */}
            <div className="relative">
              <Search className="absolute left-4 top-3 text-gray-400" size={20} />
              {isMounted ? (
                <input
                  type="text"
                  placeholder="Search for food..."
                  className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 focus:border-orange-500 focus:outline-none"
                />
              ) : (
                <div className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 bg-gray-100 animate-pulse h-11"></div>
              )}
            </div>

            {/* Restaurant Search */}
            <div className="relative">
              <Search className="absolute left-4 top-3 text-gray-400" size={20} />
              {isMounted ? (
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 focus:border-orange-500 focus:outline-none"
                />
              ) : (
                <div className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 bg-gray-100 animate-pulse h-11"></div>
              )}
            </div>
          </div>

          {/* Location and CTA */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-gray-700">Select Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-gray-400" size={20} />
                {isMounted ? (
                  <select className="w-full appearance-none rounded-lg border border-gray-300 py-3 pl-12 pr-4 focus:border-orange-500 focus:outline-none">
                    <option>New York</option>
                    <option>Los Angeles</option>
                    <option>San Francisco</option>
                    <option>Chicago</option>
                  </select>
                ) : (
                  <div className="w-full appearance-none rounded-lg border border-gray-300 py-3 pl-12 pr-4 bg-gray-100 animate-pulse h-11"></div>
                )}
              </div>
            </div>

            <button className="w-full rounded-lg bg-orange-500 px-8 py-3 text-white font-bold hover:bg-orange-600 transition sm:w-auto">
              Order Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}