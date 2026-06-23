'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, ShoppingCart, User, Package, ChefHat, MapPin, Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import GoogleSelectorModal from '@/components/GoogleSelectorModal'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false)
  const { user, loading, logout } = useAuth()
  
  const { totalItems } = useCart()

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
    <nav className="sticky top-0 z-50 bg-orange-500 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/tastepilot-logo.png"
              alt="Taste Pilot"
              width={50}
              height={50}
              className="h-12 w-12 rounded-full border border-white/20 bg-white/10"
            />
            <span className="ml-2 text-xl font-bold hidden md:block">
              <span className="text-white">Taste</span>
              <span className="text-slate-900">Pilot</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {isAuthenticated && !isAdmin && (
              <>
                <Link href="/restaurants" className="text-white hover:text-orange-100 font-medium transition">
                  Restaurants
                </Link>
                <Link href="/meal-planner" className="text-white hover:text-orange-100 font-medium transition">
                  AI Meal Planner
                </Link>
                <Link href="/orders" className="text-white hover:text-orange-100 font-medium transition">
                  Orders
                </Link>
              </>
            )}
            
            {isAdmin && (
              <>
                <Link href="/restaurants" className="text-white hover:text-orange-100 font-medium transition">
                  Restaurants
                </Link>
                <Link href="/admin" className="text-white hover:text-orange-100 font-medium transition">
                  Admin Dashboard
                </Link>
                <Link href="/orders" className="text-white hover:text-orange-100 font-medium transition">
                  Orders
                </Link>
              </>
            )}
          </div>

          {/* Right side - Auth buttons or profile */}
          <div className="hidden items-center gap-6 md:flex">
            {!isAuthenticated && (
              <>
                <Link href="/" className="text-white hover:text-orange-100 font-medium transition">
                  Home
                </Link>
                <Link href="/about" className="text-white hover:text-orange-100 font-medium transition mr-2">
                  About Us
                </Link>
              </>
            )}

            {/* Show cart only for authenticated users */}
            {isAuthenticated && !isAdmin && (
              <div className="relative">
                <Link href="/cart" className="text-white hover:text-orange-100 transition flex items-center">
                  <ShoppingCart size={24} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {/* Show login/register for guests, profile for authenticated users */}
            {!isAuthenticated && !loading && (
              <>
                <button
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-white font-semibold hover:bg-white/20 transition"
                >
                  <svg className="h-4 w-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
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
                  <span>Google</span>
                </button>
                <Link href="/auth/login" className="px-4 py-2 text-white font-semibold hover:text-orange-100 transition">
                  Login
                </Link>
                <Link href="/auth/register" className="rounded-lg bg-white px-6 py-2 text-orange-600 font-semibold hover:bg-orange-50 transition shadow-sm">
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
                  className="flex items-center gap-2 text-white hover:text-orange-100 transition"
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/50 shadow-sm">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-white flex items-center justify-center">
                        <User className="text-orange-500" size={20} />
                      </div>
                    )}
                  </div>
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
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
                    <Link 
                      href="/wishlist" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Wishlist
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
                  className="flex items-center gap-2 text-white hover:text-orange-100 transition"
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/50 shadow-sm">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-white flex items-center justify-center">
                        <User className="text-orange-500" size={20} />
                      </div>
                    )}
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
            className="md:hidden text-white hover:text-orange-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t md:hidden fixed inset-0 bg-orange-600 z-40">
            <div className="p-4">
              <div className="flex justify-end pb-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-orange-100"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6 pt-4 text-center">
                {!isAuthenticated && (
                  <Link 
                    href="/" 
                    className="block text-2xl text-white hover:text-orange-100 font-semibold py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                )}
                
                {/* Guest mobile menu */}
                {!isAuthenticated && !loading && (
                  <>
                    <Link 
                      href="/about" 
                      className="block text-2xl text-white hover:text-orange-100 font-semibold py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link 
                      href="/auth/login" 
                      className="block text-2xl text-white hover:text-orange-100 font-semibold py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/auth/register" 
                      className="block text-2xl bg-white text-orange-600 rounded-lg py-2.5 font-bold shadow mb-4"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                    <button 
                      onClick={() => {
                        setIsOpen(false);
                        setIsGoogleModalOpen(true);
                      }}
                      className="w-full text-2xl border border-white/30 bg-white/10 text-white rounded-lg py-2.5 font-bold shadow flex items-center justify-center gap-2"
                    >
                      <svg className="h-6 w-6 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
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
                      <span>Continue with Google</span>
                    </button>
                  </>
                )}
                
                {/* Authenticated user mobile menu */}
                {isAuthenticated && !isAdmin && (
                  <>
                    <Link 
                      href="/restaurants" 
                      className="block text-2xl text-white hover:text-orange-100 font-semibold py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Restaurants
                    </Link>
                    <Link 
                      href="/meal-planner" 
                      className="block text-2xl text-white hover:text-orange-100 font-semibold py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      AI Meal Planner
                    </Link>
                    <Link 
                      href="/orders" 
                      className="block text-2xl text-white hover:text-orange-100 font-semibold py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link 
                      href="/profile" 
                      className="block text-2xl text-white hover:text-orange-100 font-semibold py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/wishlist" 
                      className="block text-2xl text-white hover:text-orange-100 font-semibold py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      My Wishlist
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-center text-2xl text-orange-100 hover:text-white font-semibold py-2"
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
                      className="block text-2xl text-white hover:text-orange-100 font-semibold py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Restaurants
                    </Link>
                    <Link 
                      href="/admin" 
                      className="block text-2xl text-white hover:text-orange-100 font-semibold py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <Link 
                      href="/orders" 
                      className="block text-2xl text-white hover:text-orange-100 font-semibold py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Orders
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-center text-2xl text-orange-100 hover:text-white font-semibold py-2"
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

      <GoogleSelectorModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        redirectPath="/restaurants"
      />
    </nav>
  )
}