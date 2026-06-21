'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, ShoppingCart, User, Package, ChefHat, MapPin, Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const { user, loading, logout } = useAuth()
  
  // Mock cart items count - in a real app this would come from a cart context
  const [cartItemCount, setCartItemCount] = useState(0)

  // Initialize cart count - in a real app this would come from user's session or cart context
  useEffect(() => {
    // This is a mock implementation - in a real app, this would be connected to a cart context
    // or fetched from user's session
    setCartItemCount(3); // Default mock value
  }, [])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isProfileDropdownOpen) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isProfileDropdownOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Determine user role
  const isAdmin = user?.role === 'admin'
  const isAuthenticated = !!user && !loading

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/tastepilot-logo.png"
              alt="Taste Pilot"
              width={50}
              height={50}
              className="h-12 w-12"
            />
            <span className="ml-2 text-xl font-bold hidden md:block">
              <span className="text-blue-600">Taste</span>
              <span className="text-orange-500">Pilot</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-gray-600 hover:text-orange-500 font-medium transition">
              Home
            </Link>

            <Link href="/about" className="text-gray-600 hover:text-orange-500 font-medium transition">
              About Us
            </Link>
            
            {isAuthenticated && !isAdmin && (
              <>
                <Link href="/restaurants" className="text-gray-600 hover:text-orange-500 font-medium transition">
                  Restaurants
                </Link>
                <Link href="/concierge" className="text-gray-600 hover:text-orange-500 font-medium transition">
                  AI Concierge
                </Link>
                <Link href="/meal-planner" className="text-gray-600 hover:text-orange-500 font-medium transition">
                  AI Meal Planner
                </Link>
                <Link href="/orders" className="text-gray-600 hover:text-orange-500 font-medium transition">
                  Orders
                </Link>
              </>
            )}
            
            {isAdmin && (
              <>
                <Link href="/restaurants" className="text-gray-600 hover:text-orange-500 font-medium transition">
                  Restaurants
                </Link>
                <Link href="/admin" className="text-gray-600 hover:text-orange-500 font-medium transition">
                  Admin Dashboard
                </Link>
                <Link href="/orders" className="text-gray-600 hover:text-orange-500 font-medium transition">
                  Orders
                </Link>
              </>
            )}
          </div>

          {/* Right side - Auth buttons or profile */}
          <div className="hidden items-center gap-4 md:flex">
            {/* Show cart only for authenticated users */}
            {isAuthenticated && !isAdmin && (
              <div className="relative">
                <Link href="/cart" className="text-gray-600 hover:text-orange-500 transition">
                  <ShoppingCart size={24} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {/* Show login/register for guests, profile for authenticated users */}
            {!isAuthenticated && !loading && (
              <>
                <Link href="/auth/login" className="px-6 py-2 text-gray-700 font-semibold hover:text-orange-500 transition">
                  Login
                </Link>
                <Link href="/auth/register" className="rounded-lg bg-orange-500 px-6 py-2 text-white font-semibold hover:bg-orange-600 transition">
                  Register
                </Link>
              </>
            )}

            {isAuthenticated && !isAdmin && (
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
                >
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="text-orange-600" size={20} />
                  </div>
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 text-orange-600"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {isAdmin && (
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
                >
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="text-orange-600" size={20} />
                  </div>
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link 
                      href="/admin" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 hover:text-orange-500"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t md:hidden fixed inset-0 bg-white z-40">
            <div className="p-4">
              <div className="flex justify-end pb-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 hover:text-orange-500"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6 pt-4">
                <Link 
                  href="/" 
                  className="block text-xl text-gray-600 hover:text-orange-500 font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                
                {/* Guest mobile menu */}
                {!isAuthenticated && !loading && (
                  <>
                    <Link 
                      href="/about" 
                      className="block text-xl text-gray-600 hover:text-orange-500 font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link 
                      href="/auth/login" 
                      className="block text-xl text-gray-600 hover:text-orange-500 font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/auth/register" 
                      className="block text-xl text-gray-600 hover:text-orange-500 font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
                
                {/* Authenticated user mobile menu */}
                {isAuthenticated && !isAdmin && (
                  <>
                    <Link 
                      href="/restaurants" 
                      className="block text-xl text-gray-600 hover:text-orange-500 font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Restaurants
                    </Link>
                    <Link 
                      href="/concierge" 
                      className="block text-xl text-gray-600 hover:text-orange-500 font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      AI Concierge
                    </Link>
                    <Link 
                      href="/meal-planner" 
                      className="block text-xl text-gray-600 hover:text-orange-500 font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      AI Meal Planner
                    </Link>
                    <Link 
                      href="/orders" 
                      className="block text-xl text-gray-600 hover:text-orange-500 font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link 
                      href="/profile" 
                      className="block text-xl text-gray-600 hover:text-orange-500 font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left text-xl text-gray-600 hover:text-orange-500 font-medium py-2"
                    >
                      Logout
                    </button>
                  </>
                )}
                
                {/* Admin mobile menu */}
                {isAdmin && (
                  <>
                    <Link 
                      href="/restaurants" 
                      className="block text-xl text-gray-600 hover:text-orange-500 font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Restaurants
                    </Link>
                    <Link 
                      href="/admin" 
                      className="block text-xl text-gray-600 hover:text-orange-500 font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <Link 
                      href="/orders" 
                      className="block text-xl text-gray-600 hover:text-orange-500 font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Orders
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left text-xl text-gray-600 hover:text-orange-500 font-medium py-2"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}