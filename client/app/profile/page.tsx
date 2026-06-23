'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ProfileSidebar from '@/components/profile-sidebar'
import ProfileInfo from '@/components/profile-info'
import SavedAddresses from '@/components/saved-addresses'
import OrderStatistics from '@/components/order-statistics'
import RecentOrders from '@/components/recent-orders'
import { apiCall, isAuthenticated } from '@/lib/auth'

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState('profile')
  const [orders, setOrders] = useState<any[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)

  // Sync active section with search param
  useEffect(() => {
    const section = searchParams.get('section') || 'profile'
    setActiveSection(section)
  }, [searchParams])

  // Fetch orders and handle authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login')
      return
    }

    const fetchOrders = async () => {
      try {
        setIsLoadingOrders(true)
        const res = await apiCall('/orders/my')
        const json = await res.json()
        if (res.ok && json.success && json.data) {
          setOrders(json.data)
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      } finally {
        setIsLoadingOrders(false)
      }
    }

    fetchOrders()
  }, [router])

  return (
    <div className="flex">
      {/* Sidebar */}
      <ProfileSidebar activeSection={activeSection} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-20 md:pt-0">
        <div className="max-w-6xl mx-auto p-6 md:p-8">
          {activeSection === 'profile' && (
            <>
              <ProfileInfo />
              <div className="mt-12">
                <OrderStatistics orders={orders} />
              </div>
              <div className="mt-12">
                <RecentOrders orders={orders} isLoading={isLoadingOrders} />
              </div>
            </>
          )}
          {activeSection === 'orders' && (
            <>
              <OrderStatistics orders={orders} />
              <div className="mt-12">
                <RecentOrders orders={orders} isLoading={isLoadingOrders} />
              </div>
            </>
          )}
          {activeSection === 'addresses' && <SavedAddresses />}
        </div>
      </main>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Navbar />
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading profile...</div>}>
          <ProfileContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}