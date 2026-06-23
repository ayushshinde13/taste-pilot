'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { apiCall, isAuthenticated } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, ChevronRight, Clock, ShoppingBag } from 'lucide-react'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login')
      return
    }

    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const res = await apiCall('/orders/my')
        const json = await res.json()
        if (json.success && json.data) {
          setOrders(json.data)
        } else {
          setError(json.message || 'Failed to load orders')
        }
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'An error occurred while loading orders')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Placed':
        return 'bg-blue-100 text-blue-800'
      case 'Preparing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800'
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <main className="min-h-screen w-full bg-gray-50 flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600 mb-8">Track and manage your order history.</p>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white p-6 rounded-xl border border-gray-150 animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Retry
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
              <div className="text-6xl mb-6">🍔</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">You haven't placed any food orders yet.</p>
              <a
                href="/restaurants"
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
              >
                Order Now
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => router.push(`/orders/${order._id}`)}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-600">Total Amount</p>
                        <p className="text-lg font-bold text-orange-500">₹{order.totalAmount}</p>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {order.restaurant?.name || 'Restaurant'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400" />
                          {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {order.items.map((item: any, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full font-medium"
                            >
                              {item.name} × {item.quantity}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center text-orange-500 hover:translate-x-1 transition-transform self-center">
                        <span className="text-sm font-semibold hidden sm:inline">Track Order</span>
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}