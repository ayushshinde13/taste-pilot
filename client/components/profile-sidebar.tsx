'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronRight, Menu, X } from 'lucide-react'

export default function ProfileSidebar({ activeSection }: { activeSection: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: '👤', href: '/profile?section=profile' },
    { id: 'orders', label: 'Orders & Tracking', icon: '📦', href: '/profile?section=orders' },
    { id: 'addresses', label: 'Addresses', icon: '📍', href: '/profile?section=addresses' },
  ]

  const aiItems = [
    { id: 'meal-planner', label: 'AI Meal Planner', icon: '🍳', href: '/meal-planner' },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-20 left-4 z-40 md:hidden bg-orange-500 text-white p-2 rounded-lg"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 w-64 h-screen bg-white border-r border-gray-200 z-30 transform transition-transform md:relative md:top-0 md:transform-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Account</h2>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition ${
                  activeSection === item.id
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {activeSection === item.id && <ChevronRight size={20} />}
              </Link>
            ))}

            <div className="border-t border-gray-150 my-4 pt-4">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">AI Tools</p>
              {aiItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Logout Button */}
          <button className="w-full mt-8 px-4 py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition">
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
