'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight, Calendar, DollarSign, Loader2 } from 'lucide-react'

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  totalAmount: number
  status: 'Placed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled'
  items: OrderItem[]
  createdAt: string
  restaurant?: {
    name: string
    image?: string
    address?: string
  }
}

interface RecentOrdersProps {
  orders: Order[]
  isLoading: boolean
}

export default function RecentOrders({ orders, isLoading }: RecentOrdersProps) {
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Placed':
      case 'Preparing':
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center border border-gray-100">
          <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
          <p className="text-gray-500 font-medium">Loading orders history...</p>
        </div>
      </div>
    )
  }

  // Show top 5 recent orders on dashboard
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
        {orders.length > 5 && (
          <button
            onClick={() => router.push('/profile?section=orders')}
            className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition"
          >
            View All Orders ({orders.length})
          </button>
        )}
      </div>

      {recentOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <button
            onClick={() => router.push('/restaurants')}
            className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition shadow-sm"
          >
            Order Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:border-orange-200 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {order.restaurant?.name || 'Restaurant'}
                  </h3>
                  <p className="text-sm text-gray-500">Order ID: {order._id.substring(order._id.length - 8).toUpperCase()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 font-medium">Items:</p>
                <p className="text-gray-700">
                  {order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Order Date</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 font-semibold text-sm">₹</span>
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="text-sm font-semibold text-gray-900">₹{order.totalAmount}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/orders/${order._id}`)}
                  className="flex items-center justify-end gap-2 text-orange-500 font-semibold hover:text-orange-600 transition"
                >
                  <span>Track</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
