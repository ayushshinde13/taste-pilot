'use client'

import { Suspense, useState } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ProfileSidebar from '@/components/profile-sidebar'
import ProfileInfo from '@/components/profile-info'
import SavedAddresses from '@/components/saved-addresses'
import OrderStatistics from '@/components/order-statistics'
import RecentOrders from '@/components/recent-orders'

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('profile')

  // Get section from URL
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const section = params.get('section') || 'profile'
    if (section !== activeSection) {
      setActiveSection(section)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <ProfileSidebar activeSection={activeSection} />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pt-20 md:pt-0">
          <div className="max-w-6xl mx-auto p-6 md:p-8">
            <Suspense fallback={<div>Loading...</div>}>
              {activeSection === 'profile' && (
                <>
                  <ProfileInfo />
                  <div className="mt-12">
                    <OrderStatistics />
                  </div>
                  <div className="mt-12">
                    <RecentOrders />
                  </div>
                </>
              )}
              {activeSection === 'orders' && (
                <>
                  <OrderStatistics />
                  <div className="mt-12">
                    <RecentOrders />
                  </div>
                </>
              )}
              {activeSection === 'addresses' && <SavedAddresses />}
            </Suspense>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}